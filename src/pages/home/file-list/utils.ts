export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatDate(timestamp?: string): string {
  if (!timestamp) return 'Unknown'
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getFileType(
  name: string,
  isDir: boolean
): 'folder' | 'image' | 'gif' | 'video' | 'document' | 'code' | 'archive' | 'text' {
  if (isDir) return 'folder'
  const ext = name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'bmp', 'svg', 'webp'].includes(ext || '')) return 'image'
  if (['gif'].includes(ext || '')) return 'gif'
  if (['mp4', 'avi', 'mov', 'wmv', 'mkv'].includes(ext || '')) return 'video'
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || ''))
    return 'document'
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'rs'].includes(ext || ''))
    return 'code'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return 'archive'
  return 'text'
}

export function getFolderName(path: string): string {
  const parts = path.split(/[\/\\]/)
  return parts[parts.length - 1] || 'Downloads'
}
