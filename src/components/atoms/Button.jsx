import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon = null,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-dark disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50",
    secondary: "bg-surface text-white border border-surface-light hover:bg-surface-light focus:ring-surface-light/50",
    accent: "bg-gradient-accent text-white hover:shadow-lg hover:shadow-accent/25 focus:ring-accent/50",
    success: "bg-gradient-success text-white hover:shadow-lg hover:shadow-success/25 focus:ring-success/50",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-error/50",
    ghost: "text-gray-300 hover:text-white hover:bg-surface-light focus:ring-surface-light/50"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 mr-2 animate-spin" 
        />
      )}
      {!loading && icon && (
        <ApperIcon 
          name={icon} 
          className={`w-4 h-4 ${children ? 'mr-2' : ''}`} 
        />
      )}
      {children}
    </motion.button>
  )
}

export default Button