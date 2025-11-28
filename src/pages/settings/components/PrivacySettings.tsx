import { Shield, File, Eye, EyeOff, Lock, Trash2, FolderLock, Plus, X } from 'lucide-react'
import { useState } from 'react'

export function PrivacySettings() {
  const [excludedFiles, setExcludedFiles] = useState([
    { id: 1, name: 'passwords.txt', path: 'C:/Users/supak/Documents/passwords.txt' },
    { id: 2, name: 'private_notes.md', path: 'C:/Users/supak/Documents/private_notes.md' },
    { id: 3, name: 'financial_data.xlsx', path: 'C:/Users/supak/Downloads/financial_data.xlsx' },
  ])

  const [excludedFolders, setExcludedFolders] = useState([
    { id: 1, name: 'Private', path: 'C:/Users/supak/Documents/Private' },
    { id: 2, name: 'Confidential', path: 'C:/Users/supak/Work/Confidential' },
  ])

  const [privacyOptions, setPrivacyOptions] = useState({
    allowOrganize: true,
    allowAIAnalysis: true,
    allowCloudSync: false,
    shareUsageData: false,
  })

  const removeExcludedFile = (id: number) => {
    setExcludedFiles(prev => prev.filter(file => file.id !== id))
  }

  const removeExcludedFolder = (id: number) => {
    setExcludedFolders(prev => prev.filter(folder => folder.id !== id))
  }

  const addExcludedFile = () => {
    // Mock: In real app, this would open a file picker
    const mockFile = {
      id: Date.now(),
      name: 'new_private_file.txt',
      path: 'C:/Users/supak/Documents/new_private_file.txt'
    }
    setExcludedFiles(prev => [...prev, mockFile])
  }

  const addExcludedFolder = () => {
    // Mock: In real app, this would open a folder picker
    const mockFolder = {
      id: Date.now(),
      name: 'New Private Folder',
      path: 'C:/Users/supak/Documents/New Private Folder'
    }
    setExcludedFolders(prev => [...prev, mockFolder])
  }

  const togglePrivacyOption = (option: keyof typeof privacyOptions) => {
    setPrivacyOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-theme-text mb-2">Privacy & Data</h2>
        <p className="text-sm text-theme-secondary">
          Control what data can be processed and how your files are handled
        </p>
      </div>

      {/* Excluded Files & Folders Section */}
      <div className="bg-theme-background border border-theme rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-theme-primary-light flex items-center justify-center">
            <FolderLock className="h-5 w-5 text-theme-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-text">Excluded Files & Folders</h3>
            <p className="text-sm text-theme-secondary">
              Lock specific files and folders from AI analysis and organization
            </p>
          </div>
        </div>

        {/* Excluded Files */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-theme-text">Excluded Files</p>
            <button
              onClick={addExcludedFile}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add File
            </button>
          </div>

          {excludedFiles.length === 0 ? (
            <div className="p-6 border border-dashed border-theme rounded-lg text-center">
              <Lock className="h-8 w-8 text-theme-muted mx-auto mb-2" />
              <p className="text-sm text-theme-secondary">No files excluded</p>
              <p className="text-xs text-theme-muted mt-1">Click "Add File" to lock files from AI</p>
            </div>
          ) : (
            <div className="space-y-2">
              {excludedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-theme-secondary/50 rounded-lg border border-theme hover:bg-theme-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-text truncate">{file.name}</p>
                      <p className="text-xs text-theme-muted truncate">{file.path}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExcludedFile(file.id)}
                    className="ml-2 p-1.5 rounded-lg hover:bg-theme-tertiary opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-4 w-4 text-theme-secondary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Excluded Folders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-theme-text">Excluded Folders</p>
            <button
              onClick={addExcludedFolder}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Folder
            </button>
          </div>

          {excludedFolders.length === 0 ? (
            <div className="p-6 border border-dashed border-theme rounded-lg text-center">
              <FolderLock className="h-8 w-8 text-theme-muted mx-auto mb-2" />
              <p className="text-sm text-theme-secondary">No folders excluded</p>
              <p className="text-xs text-theme-muted mt-1">Click "Add Folder" to lock entire folders from AI</p>
            </div>
          ) : (
            <div className="space-y-2">
              {excludedFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between p-3 bg-theme-secondary/50 rounded-lg border border-theme hover:bg-theme-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <FolderLock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-text truncate">{folder.name}</p>
                      <p className="text-xs text-theme-muted truncate">{folder.path}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExcludedFolder(folder.id)}
                    className="ml-2 p-1.5 rounded-lg hover:bg-theme-tertiary opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-4 w-4 text-theme-secondary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex gap-2">
            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Excluded files and folders will not be analyzed by AI, organized, or included in search results. They remain on your system but are completely ignored by Klin.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Options Section */}
      <div className="bg-theme-background border border-theme rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-theme-primary-light flex items-center justify-center">
            <Shield className="h-5 w-5 text-theme-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-text">Privacy Options</h3>
            <p className="text-sm text-theme-secondary">
              Control how your data is processed and shared
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Allow Organize */}
          <div className="flex items-center justify-between p-4 border border-theme rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-theme-text">Allow AI Organization</p>
              <p className="text-sm text-theme-secondary mt-1">
                Let AI analyze and organize your files automatically
              </p>
            </div>
            <button
              onClick={() => togglePrivacyOption('allowOrganize')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyOptions.allowOrganize ? 'bg-theme-primary' : 'bg-theme-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyOptions.allowOrganize ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Allow AI Analysis */}
          <div className="flex items-center justify-between p-4 border border-theme rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-theme-text">Allow AI Analysis</p>
              <p className="text-sm text-theme-secondary mt-1">
                Enable AI to read file contents for better insights and search
              </p>
            </div>
            <button
              onClick={() => togglePrivacyOption('allowAIAnalysis')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyOptions.allowAIAnalysis ? 'bg-theme-primary' : 'bg-theme-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyOptions.allowAIAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Cloud Sync */}
          <div className="flex items-center justify-between p-4 border border-theme rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-theme-text">Cloud Sync</p>
              <p className="text-sm text-theme-secondary mt-1">
                Sync your file metadata and preferences to the cloud
              </p>
            </div>
            <button
              onClick={() => togglePrivacyOption('allowCloudSync')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyOptions.allowCloudSync ? 'bg-theme-primary' : 'bg-theme-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyOptions.allowCloudSync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Share Usage Data */}
          <div className="flex items-center justify-between p-4 border border-theme rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-theme-text">Share Usage Data</p>
              <p className="text-sm text-theme-secondary mt-1">
                Help improve the app by sharing anonymous usage statistics
              </p>
            </div>
            <button
              onClick={() => togglePrivacyOption('shareUsageData')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyOptions.shareUsageData ? 'bg-theme-primary' : 'bg-theme-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyOptions.shareUsageData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-theme-background border border-theme rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-text">Data Management</h3>
            <p className="text-sm text-theme-secondary">
              Manage and delete your stored data
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full p-4 border border-theme rounded-lg text-left hover:bg-theme-secondary transition-colors">
            <p className="font-medium text-theme-text">Clear AI Analysis Cache</p>
            <p className="text-sm text-theme-secondary mt-1">
              Remove all cached AI analysis data (156 MB)
            </p>
          </button>

          <button className="w-full p-4 border border-theme rounded-lg text-left hover:bg-theme-secondary transition-colors">
            <p className="font-medium text-theme-text">Clear Search History</p>
            <p className="text-sm text-theme-secondary mt-1">
              Delete all search queries and results
            </p>
          </button>

          <button className="w-full p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
            <p className="font-medium text-red-600 dark:text-red-400">Delete All Data</p>
            <p className="text-sm text-red-500 dark:text-red-400/80 mt-1">
              Permanently delete all your data and settings (cannot be undone)
            </p>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Your Privacy Matters
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              All file processing happens locally on your device. No files are ever uploaded to our servers unless you explicitly enable cloud sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
