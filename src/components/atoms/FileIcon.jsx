import ApperIcon from '@/components/ApperIcon'

const FileIcon = ({ 
  type = '', 
  size = 'md', 
  className = '' 
}) => {
  const getIconAndColor = (fileType) => {
    const mimeType = fileType.toLowerCase()
    
    if (mimeType.startsWith('image/')) {
      return { icon: 'Image', gradient: 'file-image' }
    } else if (mimeType.startsWith('video/')) {
      return { icon: 'Video', gradient: 'file-video' }
    } else if (mimeType.startsWith('audio/')) {
      return { icon: 'Music', gradient: 'file-audio' }
    } else if (mimeType.includes('pdf')) {
      return { icon: 'FileText', gradient: 'file-document' }
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return { icon: 'FileText', gradient: 'file-document' }
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return { icon: 'Sheet', gradient: 'file-document' }
    } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return { icon: 'Presentation', gradient: 'file-document' }
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      return { icon: 'Archive', gradient: 'file-archive' }
    } else {
      return { icon: 'File', gradient: 'file-other' }
    }
  }

  const sizes = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
    xl: 'w-12 h-12 p-2.5'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  const { icon, gradient } = getIconAndColor(type)

  return (
    <div className={`${sizes[size]} ${gradient} rounded-lg flex items-center justify-center ${className}`}>
      <ApperIcon 
        name={icon} 
        className={`${iconSizes[size]} text-white`} 
      />
    </div>
  )
}

export default FileIcon