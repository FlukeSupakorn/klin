import { DestinationFoldersDialog } from '@/components/ui/destination-folders-dialog'
import { useDashboardStore } from '../store/useDashboardStore'

export function ManageDestinationsDialog() {
  const { 
    isManageFoldersOpen, 
    setIsManageFoldersOpen,
    destinationFolders,
    setDestinationFolders
  } = useDashboardStore()

  const handleSave = (folders: string[]) => {
    setDestinationFolders(folders)
  }

  return (
    <DestinationFoldersDialog
      open={isManageFoldersOpen}
      onOpenChange={setIsManageFoldersOpen}
      currentFolders={destinationFolders}
      onSave={handleSave}
      title="Manage Destination Folders"
      description="Configure multiple destination folders where organized files will be moved."
      showAIGenerate={true}
    />
  )
}
