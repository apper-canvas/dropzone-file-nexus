import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import FileIcon from '@/components/atoms/FileIcon'

const FileCard = ({ 
  file, 
  onPause, 
  onResume, 
  onCancel, 
  onRemove,
  index = 0 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success'
      case 'uploading': return 'text-primary'
      case 'error': return 'text-error'
      case 'paused': return 'text-warning'
      case 'cancelled': return 'text-gray-400'
      default: return 'text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'uploading': return 'Loader2'
      case 'error': return 'AlertCircle'
      case 'paused': return 'PauseCircle'
      case 'cancelled': return 'XCircle'
      default: return 'Clock'
    }
  }

  const canPause = file.status === 'uploading'
  const canResume = file.status === 'paused'
  const canCancel = ['uploading', 'paused', 'pending'].includes(file.status)
  const canRemove = ['completed', 'error', 'cancelled'].includes(file.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="glass-morphism rounded-xl p-4 hover:bg-surface/50 transition-all duration-200 group"
    >
      <div className="flex items-start space-x-4">
        {/* File Icon or Thumbnail */}
        <div className="flex-shrink-0">
          {file.thumbnailUrl ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg overflow-hidden bg-surface border border-surface-light"
            >
              <img 
                src={file.thumbnailUrl} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <FileIcon type={file.type} size="lg" />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate text-sm">
                {file.name}
              </h4>
              <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="capitalize">{file.type.split('/')[0] || 'File'}</span>
                {file.uploadedAt && (
                  <>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <ApperIcon 
                name={getStatusIcon(file.status)} 
                className={`w-4 h-4 ${getStatusColor(file.status)} ${
                  file.status === 'uploading' ? 'animate-spin' : ''
                }`} 
              />
              <span className={`text-xs font-medium capitalize ${getStatusColor(file.status)}`}>
                {file.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {['uploading', 'paused'].includes(file.status) && (
            <ProgressBar 
              progress={file.progress || 0}
              size="sm"
              variant={file.status === 'paused' ? 'warning' : 'primary'}
              showPercentage={false}
            />
          )}

          {file.status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="flex-1 bg-success/20 rounded-full h-1">
                <div className="bg-gradient-success h-1 rounded-full w-full" />
              </div>
              <span className="text-xs text-success font-medium">100%</span>
            </motion.div>
          )}

          {file.status === 'error' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-error bg-error/10 px-2 py-1 rounded-md"
            >
              Upload failed. Please try again.
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canPause && (
            <Button
              variant="ghost"
              size="sm"
              icon="Pause"
              onClick={() => onPause(file.id)}
              className="w-8 h-8 p-0"
            />
          )}
          
          {canResume && (
            <Button
              variant="ghost"
              size="sm"
              icon="Play"
              onClick={() => onResume(file.id)}
              className="w-8 h-8 p-0"
            />
          )}
          
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={() => onCancel(file.id)}
              className="w-8 h-8 p-0 text-error hover:text-error hover:bg-error/10"
            />
          )}
          
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onRemove(file.id)}
              className="w-8 h-8 p-0 text-gray-400 hover:text-error hover:bg-error/10"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard