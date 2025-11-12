import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useOnboarding } from './useOnboarding'
import {
  WelcomeStep,
  WatchingStep,
  ModeSelectionStep,
  AIGeneratedStep,
  DestinationsStep,
} from './steps'

export function FirstTimeSetupDialog() {
  const {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolders,
    tempWatchingFolder,
    tempDestinations,
    tempNewDestination,
    aiGeneratedFolders,
    setTempNewDestination,
    setSetupStep,
    setDestinationMode,
    handleBrowseWatchingFolder,
    handleBrowseDestinationFolder,
    handleAddTempDestination,
    removeTempDestination,
    removeTempWatchingFolder,
    completeFirstTimeSetup,
    completeAISetup,
    cancelSetup,
  } = useOnboarding()

  if (!isFirstTimeSetup) return null

  return (
    <Dialog open={isFirstTimeSetup} onOpenChange={(open) => {
      if (!open) {
        cancelSetup()
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        {/* Welcome Step */}
        {setupStep === 'welcome' && <WelcomeStep onNext={() => setSetupStep('watching')} />}

        {/* Watching Folder Step */}
        {setupStep === 'watching' && (
          <WatchingStep
            tempWatchingFolders={tempWatchingFolders}
            onAddFolder={handleBrowseWatchingFolder}
            onRemoveFolder={removeTempWatchingFolder}
            onBack={() => setSetupStep('welcome')}
            onNext={() => setSetupStep('mode-selection')}
          />
        )}

        {/* Mode Selection Step */}
        {setupStep === 'mode-selection' && (
          <ModeSelectionStep
            onSelectAI={() => {
              setDestinationMode('ai')
              setSetupStep('ai-generated')
            }}
            onSelectCustom={() => {
              setDestinationMode('custom')
              setSetupStep('destinations')
            }}
            onBack={() => setSetupStep('watching')}
          />
        )}

        {/* AI Generated Folders Preview */}
        {setupStep === 'ai-generated' && (
          <AIGeneratedStep
            tempWatchingFolder={tempWatchingFolder}
            aiGeneratedFolders={aiGeneratedFolders}
            onBack={() => setSetupStep('mode-selection')}
            onComplete={completeAISetup}
          />
        )}

        {/* Destinations Step (Custom) */}
        {setupStep === 'destinations' && (
          <DestinationsStep
            tempDestinations={tempDestinations}
            tempNewDestination={tempNewDestination}
            onSetNewDestination={setTempNewDestination}
            onBrowseFolder={handleBrowseDestinationFolder}
            onAddDestination={handleAddTempDestination}
            onRemoveDestination={removeTempDestination}
            onBack={() => setSetupStep('mode-selection')}
            onComplete={completeFirstTimeSetup}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
