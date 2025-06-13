import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DropZone = ({ onFilesSelected, disabled = false, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragOver(false)
      }
      return newCount
    })
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }
  }, [disabled, onFilesSelected])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [onFilesSelected])

  const handleBrowseClick = () => {
    document.getElementById('file-input')?.click()
  }

  return (
    <motion.div
      className={`relative border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 ${
        isDragOver ? 'drag-over' : 'hover:border-primary/50 hover:bg-primary/5'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={!disabled ? handleBrowseClick : undefined}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <input
        id="file-input"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />
      
      <AnimatePresence mode="wait">
        {isDragOver ? (
          <motion.div
            key="drag-over"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Download" className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Drop files here
              </h3>
              <p className="text-gray-300">
                Release to upload your files
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 mx-auto bg-gradient-dark rounded-full flex items-center justify-center border border-surface-light"
            >
              <ApperIcon name="Upload" className="w-10 h-10 text-primary" />
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-white">
                Upload your files
              </h3>
              <p className="text-gray-400 text-lg">
                Drag and drop files here, or{' '}
                <span className="text-primary hover:text-secondary transition-colors cursor-pointer font-medium">
                  browse
                </span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-surface rounded-md">Images</span>
              <span className="px-2 py-1 bg-surface rounded-md">Documents</span>
              <span className="px-2 py-1 bg-surface rounded-md">Videos</span>
              <span className="px-2 py-1 bg-surface rounded-md">Audio</span>
              <span className="px-2 py-1 bg-surface rounded-md">Archives</span>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              icon="FolderOpen"
              onClick={(e) => {
                e.stopPropagation()
                handleBrowseClick()
              }}
              className="font-display"
            >
              Browse Files
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-glow opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}

export default DropZone