import { motion } from 'framer-motion'
import FileUploadManager from '@/components/organisms/FileUploadManager'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-full p-6"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            File Upload Made{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Effortless
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Drag, drop, and upload your files with real-time progress tracking and lightning-fast speeds.
          </p>
        </motion.div>

        <FileUploadManager />
      </div>
    </motion.div>
  )
}

export default Home