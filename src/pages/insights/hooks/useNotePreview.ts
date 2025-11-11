import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { generateFolderNote } from '@/lib/ai-api'
import { FileNode } from '../components/FileTreeNode'

/**
 * Hook for managing file/folder preview and AI note generation
 */
export function useNotePreview() {
  const [selectedItem, setSelectedItem] = useState<FileNode | null>(null)
  const [notePreview, setNotePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectItem = async (item: FileNode) => {
    setSelectedItem(item)
    setIsLoading(true)
    setNotePreview('')
    
    try {
      if (item.isDir) {
        // For folders, show AI-generated note
        const note = await generateFolderNote(item.path, item.name)
        setNotePreview(note)
      } else {
        // For files, check if it's a text file first
        const ext = item.name.split('.').pop()?.toLowerCase()
        const textFormats = ['txt', 'md', 'json', 'xml', 'csv', 'log', 'html', 'css', 'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp', 'h', 'rs', 'go', 'php', 'rb', 'sh', 'yml', 'yaml', 'toml', 'ini', 'sql']
        const binaryFormats = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'zip', 'rar', '7z', 'exe', 'dll', 'bin', 'iso', 'img', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico', 'webp', 'mp3', 'mp4', 'avi', 'mkv', 'mov', 'wav', 'flac', 'ogg']
        
        if (binaryFormats.includes(ext || '')) {
          // For binary files, show nice preview unavailable message
          setNotePreview(`# 📄 ${item.name}

**Path:** \`${item.path}\`

---

## 🖼️ Preview Not Available

This is a **${ext?.toUpperCase()}** file which requires a specialized viewer.

### File Type: ${getFileTypeDescription(ext || '')}

### How to View

1. **Double-click** the file in File Explorer to open with default application
2. Or **right-click** → "Open with" to choose a specific program

### Supported Applications

${getSupportedApps(ext || '')}

---

*💡 Tip: You can also drag this file to your preferred application to open it.*`)
        } else if (textFormats.includes(ext || '')) {
          // For text files, try to read content
          try {
            const content = await invoke<string>('read_file_content', { filePath: item.path })
            setNotePreview(`# 📄 ${item.name}

**Path:** \`${item.path}\`  
**Type:** ${ext?.toUpperCase()} File  
**Size:** ${(content.length / 1024).toFixed(2)} KB

---

## File Content

\`\`\`${ext}
${content}
\`\`\``)
          } catch (error) {
            console.error('Failed to read text file:', error)
            setNotePreview(`# ⚠️ Unable to Read File

**File:** ${item.name}  
**Path:** \`${item.path}\`

---

## Error

Could not read file content. The file may be:
- Too large to display
- Using a different text encoding
- Locked by another application
- Access restricted

### Recommendation

Try opening the file with a text editor like Notepad, VS Code, or Sublime Text.`)
          }
        } else {
          // Unknown file type
          setNotePreview(`# 📄 ${item.name}

**Path:** \`${item.path}\`  
**Extension:** ${ext?.toUpperCase() || 'Unknown'}

---

## Unknown File Type

This file type is not recognized. You can try:

1. Opening it with a text editor to see if it contains text
2. Using your system's default application
3. Searching online for programs that support **.${ext}** files

---

*Right-click the file and select "Open with" to choose an application.*`)
        }
      }
    } catch (error) {
      console.error('Failed to load preview:', error)
      setNotePreview('# ❌ Error\n\nFailed to generate preview.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectedItem,
    notePreview,
    isLoading,
    onSelectItem: handleSelectItem,
  }
}

// Helper function to get file type description
function getFileTypeDescription(ext: string): string {
  const descriptions: Record<string, string> = {
    pdf: 'PDF Document',
    docx: 'Microsoft Word Document',
    doc: 'Microsoft Word Document (Legacy)',
    xlsx: 'Microsoft Excel Spreadsheet',
    xls: 'Microsoft Excel Spreadsheet (Legacy)',
    pptx: 'Microsoft PowerPoint Presentation',
    ppt: 'Microsoft PowerPoint Presentation (Legacy)',
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    svg: 'SVG Vector Image',
    mp4: 'MP4 Video',
    mp3: 'MP3 Audio',
    zip: 'ZIP Archive',
    rar: 'RAR Archive',
  }
  return descriptions[ext] || `${ext.toUpperCase()} File`
}

// Helper function to get supported applications
function getSupportedApps(ext: string): string {
  const apps: Record<string, string> = {
    pdf: '- Adobe Acrobat Reader\n- Microsoft Edge\n- Chrome/Firefox\n- Foxit Reader',
    docx: '- Microsoft Word\n- Google Docs\n- LibreOffice Writer\n- WPS Office',
    doc: '- Microsoft Word\n- Google Docs\n- LibreOffice Writer',
    xlsx: '- Microsoft Excel\n- Google Sheets\n- LibreOffice Calc\n- WPS Office',
    xls: '- Microsoft Excel\n- Google Sheets\n- LibreOffice Calc',
    pptx: '- Microsoft PowerPoint\n- Google Slides\n- LibreOffice Impress',
    jpg: '- Windows Photos\n- Paint\n- GIMP\n- Photoshop',
    jpeg: '- Windows Photos\n- Paint\n- GIMP\n- Photoshop',
    png: '- Windows Photos\n- Paint\n- GIMP\n- Photoshop',
    gif: '- Windows Photos\n- Web Browsers\n- GIMP',
    mp4: '- VLC Media Player\n- Windows Media Player\n- QuickTime',
    mp3: '- Windows Media Player\n- VLC\n- iTunes\n- Spotify',
  }
  return apps[ext] || '- Your system\'s default application\n- Check online for compatible programs'
}
