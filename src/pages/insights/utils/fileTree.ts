import { FileNode } from '../components/FileTreeNode'

/**
 * Creates a mock file tree structure for a destination folder
 * This simulates AI-generated folder organization with realistic file names
 */
export function createMockFileTree(rootPath: string): FileNode {
  const rootName = rootPath.split(/[\\/]/).pop() || rootPath
  
  // Generate realistic mock files based on AI organization patterns
  const mockCategories = [
    {
      name: '📊 Reports & Analytics',
      files: [
        'Q4_Financial_Report.pdf',
        'Sales_Analytics_2024.xlsx',
        'Market_Research.docx',
        'Performance_Dashboard.pdf',
      ],
    },
    {
      name: '📋 Planning & Strategy',
      files: [
        'Project_Roadmap.pdf',
        'Budget_Planning_2025.xlsx',
        'Strategic_Goals.docx',
        'Team_Objectives.txt',
      ],
    },
    {
      name: '📁 Archive',
      files: [
        'Legacy_Documents.pdf',
        'Old_Reports_2023.zip',
        'Historical_Data.csv',
      ],
    },
  ]

  return {
    name: rootName,
    path: rootPath,
    isDir: true,
    children: [
      ...mockCategories.map((category) => ({
        name: category.name,
        path: `${rootPath}\\${category.name}`,
        isDir: true,
        children: category.files.map((file) => ({
          name: file,
          path: `${rootPath}\\${category.name}\\${file}`,
          isDir: false,
        })),
      })),
      // Add some root-level files
      { name: 'README.md', path: `${rootPath}\\README.md`, isDir: false },
      { name: 'Summary.txt', path: `${rootPath}\\Summary.txt`, isDir: false },
      { name: 'Index.xlsx', path: `${rootPath}\\Index.xlsx`, isDir: false },
    ],
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file type is supported for preview
 */
export function isSupportedPreview(filename: string): boolean {
  const ext = getFileExtension(filename)
  const supportedFormats = ['pdf', 'xlsx', 'xls', 'docx', 'doc', 'txt', 'md', 'csv']
  return supportedFormats.includes(ext)
}

/**
 * Get file type icon emoji
 */
export function getFileTypeIcon(filename: string): string {
  const ext = getFileExtension(filename)
  const icons: Record<string, string> = {
    pdf: '📄',
    xlsx: '📊',
    xls: '📊',
    docx: '📝',
    doc: '📝',
    txt: '📃',
    md: '📝',
    csv: '📋',
    zip: '📦',
    jpg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
  }
  return icons[ext] || '📄'
}
