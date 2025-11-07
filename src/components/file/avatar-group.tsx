import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types/file'

interface AvatarGroupProps {
  users: User[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const remaining = users.length - max
  
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }
  
  const fontSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  }
  
  return (
    <div className="flex items-center -space-x-2">
      {displayUsers.map((user) => (
        <Avatar key={user.id} className={`${sizeClasses[size]} ring-2 ring-white`}>
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className={fontSize[size]}>
            {user.initials}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div 
          className={`${sizeClasses[size]} rounded-full bg-indigo-600 text-white ring-2 ring-white flex items-center justify-center ${fontSize[size]} font-semibold`}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
