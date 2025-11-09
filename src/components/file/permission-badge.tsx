import { Badge } from '@/components/ui/badge'
import type { FilePermission } from '@/types/file'

interface PermissionBadgeProps {
  permission: FilePermission
}

export function PermissionBadge({ permission }: PermissionBadgeProps) {
  const variant = permission === 'Editor' 
    ? 'editor' 
    : permission === 'Administrator' 
      ? 'administrator' 
      : 'viewOnly'
  
  return (
    <Badge variant={variant}>
      {permission}
    </Badge>
  )
}
