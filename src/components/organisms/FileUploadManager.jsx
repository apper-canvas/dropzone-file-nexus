import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { fileUploadService, uploadSessionService } from '@/services'
import DropZone from '@/components/molecules/DropZone'
import FileCard from '@/components/molecules/FileCard'
import UploadStats from '@/components/molecules/UploadStats'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FileUploadManager = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSession, setCurrentSession] = useState(null)
  const [uploadSpeed, setUploadSpeed] = useState(0)

  // Load existing files on mount
  useEffect(() => {
    loadFiles()
    loadCurrentSession()
  }, [])

  const loadFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fileUploadService.getAll()
      setFiles(result)
    } catch (err) {
      setError(err.message || 'Failed to load files')
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentSession = async () => {
    try {
      const session = await uploadSessionService.getCurrentSession()
      setCurrentSession(session)
    } catch (err) {
      console.error('Failed to load current session:', err)
    }
  }

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'image/', 'video/', 'audio/', 'application/pdf', 
      'application/msword', 'application/vnd.openxmlformats',
      'text/', 'application/zip', 'application/x-rar'
    ]

    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is 100MB.`
    }

    const isAllowedType = allowedTypes.some(type => file.type.startsWith(type))
    if (!isAllowedType) {
      return `File type "${file.type}" is not supported.`
    }

    return null
  }

  const createThumbnail = async (file) => {
    if (!file.type.startsWith('image/')) return null

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const size = 48
          
          canvas.width = size
          canvas.height = size
          
          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(size / img.width, size / img.height)
          const width = img.width * scale
          const height = img.height * scale
          const x = (size - width) / 2
          const y = (size - height) / 2
          
          ctx.drawImage(img, x, y, width, height)
          resolve(canvas.toDataURL())
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFilesSelected = useCallback(async (selectedFiles) => {
    const validFiles = []
    const errors = []

    // Validate files
    for (const file of selectedFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push(file)
      }
    }

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
    }

    if (validFiles.length === 0) return

    // Create upload session if needed
    if (!currentSession) {
      try {
        const session = await uploadSessionService.createSession({
          totalFiles: validFiles.length,
          totalSize: validFiles.reduce((sum, file) => sum + file.size, 0)
        })
        setCurrentSession(session)
      } catch (err) {
        toast.error('Failed to create upload session')
        return
      }
    } else {
      // Update existing session
      try {
        const updatedSession = await uploadSessionService.updateSession(currentSession.id, {
          totalFiles: currentSession.totalFiles + validFiles.length,
          totalSize: currentSession.totalSize + validFiles.reduce((sum, file) => sum + file.size, 0)
        })
        setCurrentSession(updatedSession)
      } catch (err) {
        console.error('Failed to update session:', err)
      }
    }

    // Process files
    for (const file of validFiles) {
      try {
        const thumbnailUrl = await createThumbnail(file)
        
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          thumbnailUrl
        }

        const newFile = await fileUploadService.create(fileData)
        setFiles(prev => [...prev, newFile])
        
        // Start upload immediately
        startUpload(newFile.id)
      } catch (err) {
        toast.error(`Failed to add file: ${file.name}`)
      }
    }

    toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''} to upload queue`)
  }, [currentSession])

  const startUpload = async (fileId) => {
    const startTime = Date.now()
    let lastProgressTime = startTime
    let lastProgressBytes = 0

    try {
      await fileUploadService.uploadFile(fileId, (progress) => {
        // Update file progress
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress } : file
        ))

        // Calculate upload speed
        const now = Date.now()
        const file = files.find(f => f.id === fileId)
        if (file && now - lastProgressTime > 1000) { // Update speed every second
          const progressBytes = (progress / 100) * file.size
          const bytesTransferred = progressBytes - lastProgressBytes
          const timeElapsed = (now - lastProgressTime) / 1000
          const speed = bytesTransferred / timeElapsed
          
          setUploadSpeed(speed)
          lastProgressTime = now
          lastProgressBytes = progressBytes
        }
      })

      // Refresh files to get updated status
      await loadFiles()
      
      // Update session
      if (currentSession) {
        await uploadSessionService.updateSession(currentSession.id, {
          completedFiles: currentSession.completedFiles + 1
        })
        await loadCurrentSession()
      }

      // Show success with confetti animation
      toast.success('File uploaded successfully!', {
        autoClose: 2000,
        className: 'animate-bounce-in'
      })
      
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`)
      await loadFiles() // Refresh to show error state
    }
  }

  const handlePause = async (fileId) => {
    try {
      await fileUploadService.pauseUpload(fileId)
      await loadFiles()
      toast.info('Upload paused')
    } catch (err) {
      toast.error('Failed to pause upload')
    }
  }

  const handleResume = async (fileId) => {
    try {
      startUpload(fileId)
      toast.info('Upload resumed')
    } catch (err) {
      toast.error('Failed to resume upload')
    }
  }

  const handleCancel = async (fileId) => {
    try {
      await fileUploadService.cancelUpload(fileId)
      await loadFiles()
      toast.warning('Upload cancelled')
    } catch (err) {
      toast.error('Failed to cancel upload')
    }
  }

  const handleRemove = async (fileId) => {
    try {
      await fileUploadService.delete(fileId)
      setFiles(prev => prev.filter(file => file.id !== fileId))
      toast.success('File removed')
    } catch (err) {
      toast.error('Failed to remove file')
    }
  }

  const handleClearCompleted = async () => {
    try {
      await fileUploadService.clearCompleted()
      setFiles(prev => prev.filter(file => file.status !== 'completed'))
      toast.success('Completed files cleared')
    } catch (err) {
      toast.error('Failed to clear completed files')
    }
  }

  const handleStartAll = () => {
    const pendingFiles = files.filter(file => file.status === 'pending')
    pendingFiles.forEach(file => startUpload(file.id))
  }

  const completedFiles = files.filter(file => file.status === 'completed')
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const hasFiles = files.length > 0
  const hasPendingFiles = files.some(file => file.status === 'pending')

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        <div className="glass-morphism rounded-xl p-8 animate-pulse">
          <div className="w-20 h-20 bg-surface-light rounded-full mx-auto mb-4" />
          <div className="h-6 bg-surface-light rounded w-1/2 mx-auto mb-2" />
          <div className="h-4 bg-surface-light rounded w-1/3 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-morphism rounded-xl p-4 animate-pulse">
              <div className="h-16 bg-surface-light rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-xl font-display font-bold text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button variant="primary" onClick={loadFiles} icon="RefreshCw">
          Try Again
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Stats */}
      <UploadStats
        totalFiles={files.length}
        completedFiles={completedFiles.length}
        totalSize={totalSize}
        uploadSpeed={uploadSpeed}
      />

      {/* Drop Zone */}
      <DropZone onFilesSelected={handleFilesSelected} />

      {/* Quick Actions */}
      {hasFiles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 glass-morphism rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Files" className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">
              {files.length} file{files.length > 1 ? 's' : ''} in queue
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasPendingFiles && (
              <Button
                variant="primary"
                size="sm"
                icon="Play"
                onClick={handleStartAll}
              >
                Start All
              </Button>
            )}
            
            {completedFiles.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleClearCompleted}
              >
                Clear Completed
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* File List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => (
            <FileCard
              key={file.id}
              file={file}
              index={index}
              onPause={handlePause}
              onResume={handleResume}
              onCancel={handleCancel}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
        
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 glass-morphism rounded-xl"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ApperIcon name="Upload" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-display font-bold text-white mb-2">
              No files uploaded yet
            </h3>
            <p className="text-gray-400">
              Drop files above or click browse to get started
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FileUploadManager