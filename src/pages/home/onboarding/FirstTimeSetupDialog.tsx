import { FolderOpen, ChevronRight } from 'lucide-react'
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
import { useOnboarding } from './useOnboarding'

export function FirstTimeSetupDialog() {
  const {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolder,
    tempDestinations,
    tempNewDestination,
    setTempNewDestination,
    setSetupStep,
    handleBrowseWatchingFolder,
    handleBrowseDestinationFolder,
    handleAddTempDestination,
    removeTempDestination,
    completeFirstTimeSetup,
  } = useOnboarding()

  if (!isFirstTimeSetup) return null

  return (
    <Dialog open={isFirstTimeSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e) => e.preventDefault()}>
        {/* Welcome Step */}
        {setupStep === 'welcome' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                Welcome to KLIN!
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Let's get you started with organizing your files automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  What KLIN can do for you:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Automatically Organize Files</p>
                      <p className="text-sm text-slate-600">
                        Watch folders and organize files by type, date, or custom rules
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Smart Renaming</p>
                      <p className="text-sm text-slate-600">
                        Rename files with meaningful names based on content analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">AI-Powered Summaries</p>
                      <p className="text-sm text-slate-600">
                        Generate summaries and insights for your documents
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 text-center">
                This quick setup will take less than a minute. Let's configure your folders!
              </p>
            </div>

            <DialogFooter>
              <Button onClick={() => setSetupStep('watching')} className="w-full">
                Get Started
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Watching Folder Step */}
        {setupStep === 'watching' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Select Watching Folder</DialogTitle>
              <DialogDescription>
                Choose a folder to watch for new files that need organizing.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Folder Path</label>
                <div className="flex gap-2">
                  <Input
                    value={tempWatchingFolder}
                    placeholder="Enter folder path (e.g., C:/Users/Downloads)"
                    className="flex-1 font-mono text-sm"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseWatchingFolder}
                    className="gap-2 flex-shrink-0"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Browse
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Default: Your Downloads folder. You can change this later in settings.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                      <li>Choose a folder where you frequently save downloads</li>
                      <li>KLIN will monitor this folder for new files</li>
                      <li>Files will be automatically organized based on your rules</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSetupStep('welcome')}>
                Back
              </Button>
              <Button
                onClick={() => setSetupStep('destinations')}
                disabled={!tempWatchingFolder.trim()}
              >
                Next: Destination Folders
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Destinations Step */}
        {setupStep === 'destinations' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Configure Destination Folders</DialogTitle>
              <DialogDescription>
                Add folders where organized files will be moved.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Destination Folders ({tempDestinations.length})
                </h3>

                {tempDestinations.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-4">
                    <svg
                      className="h-12 w-12 text-slate-400 mx-auto mb-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <p className="text-sm text-slate-600">No destination folders yet</p>
                    <p className="text-xs text-slate-500 mt-1">Add at least one folder below</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {tempDestinations.map((folder, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3"
                      >
                        <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-emerald-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 font-mono truncate" title={folder}>
                            {folder}
                          </p>
                        </div>
                        <button
                          onClick={() => removeTempDestination(folder)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add New Destination
                </label>
                <div className="flex gap-2">
                  <Input
                    value={tempNewDestination}
                    onChange={(e) => setTempNewDestination(e.target.value)}
                    placeholder="Enter folder path"
                    className="flex-1 font-mono text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTempDestination()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseDestinationFolder}
                    className="gap-2 flex-shrink-0"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Browse
                  </Button>
                  <Button onClick={handleAddTempDestination} disabled={!tempNewDestination.trim()}>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  We've added some default folders for you. You can add more or remove them.
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSetupStep('watching')}>
                Back
              </Button>
              <Button onClick={completeFirstTimeSetup} disabled={tempDestinations.length === 0}>
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Complete Setup
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
