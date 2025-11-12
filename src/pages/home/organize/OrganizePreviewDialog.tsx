import { Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileIcon } from '@/components/file/file-icon'
import { useHomeStore } from '../store/useHomeStore'
import { useOrganize } from '../hooks/useOrganize'
import { getFileType } from '../file-list/utils'

export function OrganizePreviewDialog() {
  const { isPreviewOpen, setIsPreviewOpen } = useHomeStore()
  const {
    organizePreviews,
    editingIndex,
    editName,
    editFolder,
    setEditName,
    setEditFolder,
    toggleStatus,
    handleApproveAll,
    handleRejectAll,
    startEdit,
    saveEdit,
    cancelEdit,
    confirmOrganize,
  } = useOrganize()

  return (
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-theme-primary" />
            Organization Preview
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Review the proposed file organization. You can approve, reject, or edit each file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-3">
            {organizePreviews.map((preview, index) => (
              <div
                key={preview.file.path}
                className={`border-2 rounded-lg p-4 transition-all ${
                  preview.status === 'approved'
                    ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30'
                    : preview.status === 'rejected'
                    ? 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30'
                    : 'border-theme bg-theme-background'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        preview.status === 'approved'
                          ? 'bg-green-100 dark:bg-green-900/50'
                          : preview.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900/50'
                          : 'bg-theme-secondary'
                      }`}
                    >
                      <FileIcon
                        type={getFileType(preview.file.name, preview.file.is_dir)}
                        className={`h-6 w-6 ${
                          preview.status === 'approved'
                            ? 'text-green-600 dark:text-green-400'
                            : preview.status === 'rejected'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-theme-primary'
                        }`}
                      />
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="flex-1 min-w-0">
                    {editingIndex === index ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-theme-text mb-1">
                            New Name
                          </label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-theme-text mb-1">
                            Destination Folder
                          </label>
                          <Input
                            value={editFolder}
                            onChange={(e) => setEditFolder(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Name Change */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs font-medium text-theme-muted mb-1">
                              Current Name
                            </div>
                            <div className="text-sm text-theme-text font-mono bg-theme-secondary px-2 py-1 rounded border border-theme truncate">
                              {preview.currentName}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-theme-muted mb-1">New Name</div>
                            <div
                              className={`text-sm font-mono px-2 py-1 rounded border truncate ${
                                preview.currentName !== preview.newName
                                  ? 'text-theme-primary bg-theme-primary-light border-theme-primary font-semibold'
                                  : 'text-theme-text bg-theme-secondary border-theme'
                              }`}
                            >
                              {preview.newName}
                            </div>
                          </div>
                        </div>

                        {/* Folder Change */}
                        <div>
                          <div className="text-xs font-medium text-theme-muted mb-1">Move To</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 text-xs text-theme-secondary font-mono bg-theme-secondary px-2 py-1 rounded border border-theme truncate">
                              {preview.currentFolder}
                            </div>
                            <svg
                              className="h-4 w-4 text-theme-muted flex-shrink-0"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="flex-1 text-xs text-theme-primary font-mono bg-theme-primary-light px-2 py-1 rounded border border-theme-primary font-semibold truncate">
                              {preview.destinationFolder}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              preview.status === 'approved'
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                                : preview.status === 'rejected'
                                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                                : 'bg-theme-secondary text-theme-text'
                            }`}
                          >
                            {preview.status === 'approved' && (
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {preview.status === 'rejected' && (
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {preview.status === 'pending' && (
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {preview.status.charAt(0).toUpperCase() + preview.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleStatus(index)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        preview.status === 'approved'
                          ? 'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600'
                          : preview.status === 'rejected'
                          ? 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600'
                          : 'bg-theme-primary text-white hover:bg-theme-primary-hover'
                      }`}
                    >
                      {preview.status === 'approved'
                        ? 'Approved'
                        : preview.status === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </button>
                    {editingIndex !== index && (
                      <button
                        onClick={() => startEdit(index)}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleApproveAll}>
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Approve All
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Reject All
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmOrganize}>Confirm Organization</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
