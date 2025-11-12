import { DestinationFoldersDialog } from '@/components/ui/destination-folders-dialog'
import { useHomeStore } from '../store/useHomeStore'

export function ManageDestinationsDialog() {
  const { 
    isManageFoldersOpen, 
    setIsManageFoldersOpen,
    destinationFolders,
    setDestinationFolders
  } = useHomeStore()

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
