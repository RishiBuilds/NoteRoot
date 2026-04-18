import { useAuthStore } from '@/stores/auth'
import { useDialogsStore } from '@/stores/dialogs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { KeyRound, LogOut, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserToolbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const openDialog = useDialogsStore((state) => state.openDialog)
  const navigate = useNavigate()

  if (!user) return null

  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-heading">{user.username}</span>
            <span className="text-xs text-foreground/60">{user.email}</span>
            <span className="mt-0.5 text-xs capitalize text-foreground/60">
              {user.role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openDialog('changeOwnPassword')}>
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem onClick={() => navigate('/users')}>
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
