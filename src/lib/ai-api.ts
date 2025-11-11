// Mock AI API for generating file/folder summaries and insights
// In production, this would call a real AI service

export interface FileSummary {
  filename: string
  summary: string
  keyPoints: string[]
  category: string
  importance: 'low' | 'medium' | 'high'
  generatedAt: string
}

export interface FolderInsight {
  folderPath: string
  folderName: string
  overview: string
  fileCount: number
  categories: string[]
  highlights: string[]
  importance: 'low' | 'medium' | 'high'
  generatedAt: string
}

// Mock AI response delay
const AI_DELAY = 1500

// Mock data generators
const mockSummaries: Record<string, string[]> = {
  pdf: [
    'This document contains detailed analysis of project requirements and specifications.',
    'Comprehensive guide covering best practices and implementation strategies.',
    'Research paper discussing recent advancements in the field with statistical data.',
  ],
  docx: [
    'Meeting notes from team discussion about upcoming milestones and deliverables.',
    'Proposal document outlining project scope, timeline, and resource allocation.',
    'Report summarizing quarterly performance metrics and KPIs.',
  ],
  xlsx: [
    'Financial spreadsheet containing budget breakdown and expense tracking.',
    'Data analysis workbook with charts, graphs, and statistical summaries.',
    'Inventory management sheet tracking stock levels and reorder points.',
  ],
  txt: [
    'Quick notes and reminders about tasks and action items.',
    'Configuration file with system settings and parameters.',
    'Log file recording system events and error messages.',
  ],
  default: [
    'File contains important information relevant to the project.',
    'Document with structured data and detailed content.',
    'Resource file with valuable reference material.',
  ],
}

const mockKeyPoints: Record<string, string[][]> = {
  pdf: [
    ['Project timeline: 6 months', 'Budget: $500K', 'Team size: 8 members'],
    ['Best practice #1: Code reviews', 'Best practice #2: Testing', 'Best practice #3: Documentation'],
    ['Accuracy improved by 15%', 'Response time reduced by 20%', 'User satisfaction: 92%'],
  ],
  docx: [
    ['Action item: Update roadmap', 'Decision: Use Agile', 'Next meeting: Friday'],
    ['Scope: Full stack development', 'Duration: 3 months', 'Budget approved'],
    ['Revenue up 25%', 'Customer retention: 88%', 'New users: 1,200'],
  ],
  xlsx: [
    ['Total expenses: $150K', 'Remaining budget: $350K', 'Variance: -5%'],
    ['Average sales: $50K/month', 'Peak period: Q4', 'Growth rate: 12%'],
    ['Low stock items: 15', 'Reorder needed: 8', 'Overstock: 3'],
  ],
  default: [
    ['Key information extracted', 'Relevant data points', 'Important context'],
  ],
}

const categories = [
  'Financial', 'Technical', 'Research', 'Reports', 'Documentation',
  'Meeting Notes', 'Analysis', 'Planning', 'Reference', 'Data',
]

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'default'
  return ['pdf', 'docx', 'xlsx', 'txt'].includes(ext) ? ext : 'default'
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomImportance(): 'low' | 'medium' | 'high' {
  const rand = Math.random()
  if (rand < 0.2) return 'high'
  if (rand < 0.6) return 'medium'
  return 'low'
}

// Mock API: Generate summary for a single file
export async function generateFileSummary(filename: string, filePath: string): Promise<FileSummary> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, AI_DELAY))

  const ext = getFileExtension(filename)
  const summaries = mockSummaries[ext] || mockSummaries.default
  const keyPointsSets = mockKeyPoints[ext] || mockKeyPoints.default

  return {
    filename,
    summary: getRandomItem(summaries),
    keyPoints: getRandomItem(keyPointsSets),
    category: getRandomItem(categories),
    importance: getRandomImportance(),
    generatedAt: new Date().toISOString(),
  }
}

// Mock API: Generate summary for multiple files (batch)
export async function generateBatchSummaries(files: { name: string; path: string }[]): Promise<FileSummary[]> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, AI_DELAY * 0.5))

  return Promise.all(files.map(file => generateFileSummary(file.name, file.path)))
}

// Mock API: Generate folder overview/insight
export async function generateFolderInsight(
  folderPath: string,
  folderName: string,
  fileCount: number
): Promise<FolderInsight> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, AI_DELAY))

  const overviews = [
    `This folder contains ${fileCount} files primarily focused on project documentation and planning materials.`,
    `Collection of ${fileCount} files related to data analysis, reports, and performance metrics.`,
    `Archive of ${fileCount} files including research papers, technical documentation, and reference materials.`,
    `Working directory with ${fileCount} files containing meeting notes, proposals, and team communications.`,
    `Resource folder with ${fileCount} files for financial records, budgets, and expense tracking.`,
  ]

  const highlights = [
    'Contains critical project information',
    'Recently updated with new data',
    'High-priority documents included',
    'Frequently accessed by team',
    'Important deadlines and milestones',
    'Key stakeholder documents',
    'Essential reference materials',
  ]

  const selectedCategories = categories
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2)

  const selectedHighlights = highlights
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2)

  return {
    folderPath,
    folderName,
    overview: getRandomItem(overviews),
    fileCount,
    categories: selectedCategories,
    highlights: selectedHighlights,
    importance: getRandomImportance(),
    generatedAt: new Date().toISOString(),
  }
}

// Mock API: Get featured/interesting folders
export async function getFeaturedFolders(allFolders: string[]): Promise<FolderInsight[]> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, AI_DELAY * 0.3))

  // Pick 3-5 random folders as "featured"
  const count = Math.min(Math.floor(Math.random() * 3) + 3, allFolders.length)
  const featured = allFolders.sort(() => Math.random() - 0.5).slice(0, count)

  return Promise.all(
    featured.map(path => {
      const name = path.split(/[\\/]/).pop() || path
      const fileCount = Math.floor(Math.random() * 50) + 5
      return generateFolderInsight(path, name, fileCount)
    })
  )
}

// Mock API: Create note from file summaries
export async function createNoteFromSummaries(
  summaries: FileSummary[],
  title: string
): Promise<{ filename: string; content: string }> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, AI_DELAY))

  // Generate markdown content from summaries
  const content = `# ${title}

*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*

## Overview

This note summarizes ${summaries.length} file${summaries.length > 1 ? 's' : ''} selected for analysis.

---

${summaries.map((summary, index) => `
### ${index + 1}. ${summary.filename}

**Category:** ${summary.category}  
**Importance:** ${summary.importance.toUpperCase()}

**Summary:**  
${summary.summary}

**Key Points:**
${summary.keyPoints.map(point => `- ${point}`).join('\n')}

---
`).join('\n')}

## Conclusion

All ${summaries.length} files have been analyzed and summarized above. This provides a quick overview of the content without needing to open each file individually.
`

  return {
    filename: `${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-')}.md`,
    content,
  }
}
