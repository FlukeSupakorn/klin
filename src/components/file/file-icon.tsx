import { FileText, Folder, Image, FileArchive, FileCode, Film, File } from 'lucide-react'
import type { FileItem } from '@/types/file'

interface FileIconProps {
  type: FileItem['type']
  className?: string
}

export function FileIcon({ type, className = "h-5 w-5" }: FileIconProps) {
  switch (type) {
    case 'folder':
      return <Folder className={className} />
    case 'image':
    case 'gif':
      return <Image className={className} />
    case 'video':
      return <Film className={className} />
    case 'document':
      return <FileText className={className} />
    case 'code':
      return <FileCode className={className} />
    case 'archive':
      return <FileArchive className={className} />
    case 'text':
    default:
      return <File className={className} />
  }
}
