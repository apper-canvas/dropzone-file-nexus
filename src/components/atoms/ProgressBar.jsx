import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  size = 'md',
  variant = 'primary',
  animated = true,
  className = ''
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const variants = {
    primary: 'progress-bar',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-to-r from-warning to-yellow-400',
    error: 'bg-gradient-to-r from-error to-red-400'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-surface-light rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-300`}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <motion.div 
          className="mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs text-gray-400 font-medium">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default ProgressBar