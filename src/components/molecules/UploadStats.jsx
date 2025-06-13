import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const UploadStats = ({ 
  totalFiles = 0,
  completedFiles = 0,
  totalSize = 0,
  uploadSpeed = 0,
  className = ''
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond) => {
    return formatFileSize(bytesPerSecond) + '/s'
  }

  const completionRate = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0

  const stats = [
    {
      label: 'Total Files',
      value: totalFiles.toString(),
      icon: 'Files',
      gradient: 'from-primary to-secondary'
    },
    {
      label: 'Completed',
      value: completedFiles.toString(),
      icon: 'CheckCircle',
      gradient: 'from-success to-primary'
    },
    {
      label: 'Total Size',
      value: formatFileSize(totalSize),
      icon: 'HardDrive',
      gradient: 'from-info to-primary'
    },
    {
      label: 'Upload Speed',
      value: formatSpeed(uploadSpeed),
      icon: 'Zap',
      gradient: 'from-accent to-secondary'
    }
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="glass-morphism rounded-xl p-4 hover:bg-surface/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
              <ApperIcon name={stat.icon} className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-400 truncate">{stat.label}</p>
              <p className="text-lg font-semibold text-white truncate">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Completion Progress */}
      {totalFiles > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="col-span-2 lg:col-span-4 glass-morphism rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm font-medium text-white">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UploadStats