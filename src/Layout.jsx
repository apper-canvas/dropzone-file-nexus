import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-dark">
      {/* Header */}
      <header className="flex-shrink-0 h-16 glass-morphism border-b border-surface-light z-40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 bg-gradient-primary rounded-lg">
              <ApperIcon name="Upload" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white">DropZone</h1>
              <p className="text-xs text-gray-400">File Upload Manager</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-right">
              <p className="text-sm text-white font-medium">Ready to Upload</p>
              <p className="text-xs text-gray-400">Drag & drop files here</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout