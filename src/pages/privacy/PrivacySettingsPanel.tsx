import { useState } from 'react'
import { usePrivacyStore, ExcludePatternType } from './store/usePrivacyStore'
import { Plus, Trash2 } from 'lucide-react'
import { selectFolder } from '@/lib/tauri-api'
import { generateUUID } from '@/lib/uuid'

export function PrivacySettingsPanel() {
  const {
    excludedFiles,
    excludedFolders,
    patterns,
    addExcludedFile,
    removeExcludedFile,
    addExcludedFolder,
    removeExcludedFolder,
    addPattern,
    removePattern,
  } = usePrivacyStore()

  const [newPatternType, setNewPatternType] = useState<ExcludePatternType>('starts-with')
  const [newPatternValue, setNewPatternValue] = useState('')

  const handleAddFile = async () => {
    // Fallback: no selectFile API; allow manual input via prompt
    const path = window.prompt('Enter full file path to exclude:')
    if (path) addExcludedFile(path)
  }

  const handleAddFolder = async () => {
    const path = await selectFolder()
    if (path) addExcludedFolder(path)
  }

  const handleAddPattern = () => {
    if (!newPatternValue.trim()) return
    addPattern({ id: generateUUID(), type: newPatternType, value: newPatternValue.trim() })
    setNewPatternValue('')
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Privacy & Data Exclusions</h2>
        <p className="text-sm text-slate-600">Control which files and folders are excluded from processing. Add pattern rules for flexible privacy control.</p>
      </div>

      {/* Excluded Folders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Excluded Folders</h3>
          <button onClick={handleAddFolder} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md">
            <Plus className="h-3.5 w-3.5" /> Add Folder
          </button>
        </div>
        {excludedFolders.length === 0 ? (
          <p className="text-xs text-slate-500">No excluded folders.</p>
        ) : (
          <ul className="space-y-2">
            {excludedFolders.map((p) => (
              <li key={p} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-slate-700 truncate">{p}</span>
                <button onClick={() => removeExcludedFolder(p)} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Excluded Files */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Excluded Files</h3>
          <button onClick={handleAddFile} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md">
            <Plus className="h-3.5 w-3.5" /> Add File
          </button>
        </div>
        {excludedFiles.length === 0 ? (
          <p className="text-xs text-slate-500">No excluded files.</p>
        ) : (
          <ul className="space-y-2">
            {excludedFiles.map((p) => (
              <li key={p} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-slate-700 truncate">{p}</span>
                <button onClick={() => removeExcludedFile(p)} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pattern Rules */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Pattern Exclusions</h3>
        <div className="flex items-center gap-2 mb-3">
          <select
            value={newPatternType}
            onChange={(e) => setNewPatternType(e.target.value as ExcludePatternType)}
            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white"
          >
            <option value="starts-with">Starts with</option>
            <option value="ends-with">Ends with</option>
            <option value="contains">Contains</option>
            <option value="extension">Extension (e.g. .pdf)</option>
            <option value="matches-date">Matches Date (YYYY-MM-DD)</option>
          </select>
          <input
            value={newPatternValue}
            onChange={(e) => setNewPatternValue(e.target.value)}
            placeholder="Enter value (text, date, or extension)"
            className="flex-1 text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white"
          />
          <button onClick={handleAddPattern} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md">
            <Plus className="h-3.5 w-3.5" /> Add Rule
          </button>
        </div>

        {patterns.length === 0 ? (
          <p className="text-xs text-slate-500">No pattern rules yet.</p>
        ) : (
          <ul className="space-y-2">
            {patterns.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">{p.type}</span>
                  <span className="text-xs text-slate-600">{p.value}</span>
                </div>
                <button onClick={() => removePattern(p.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
