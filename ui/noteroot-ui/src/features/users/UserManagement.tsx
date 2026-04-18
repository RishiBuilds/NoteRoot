import { useUserStore } from '@/stores/users'
import { useDialogsStore } from '@/stores/dialogs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, Plus, KeyRound } from 'lucide-react'
import DeleteUserButton from './DeleteUserButton'

export default function UserManagement() {
  const { users, loadUsers } = useUserStore()
  const openDialog = useDialogsStore((state) => state.openDialog)

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={() => openDialog('userForm', { user: null })}
          size="sm"
        >
          <Plus size={14} className="mr-1" />
          Add User
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-heading text-foreground/80">
                Username
              </th>
              <th className="px-4 py-3 text-left text-sm font-heading text-foreground/80">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-heading text-foreground/80">
                Role
              </th>
              <th className="px-4 py-3 text-right text-sm font-heading text-foreground/80">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                <td className="px-4 py-3 text-sm text-foreground/60">{user.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="neutral"
                      size="icon"
                      onClick={() => openDialog('userForm', { user })}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="neutral"
                      size="icon"
                      onClick={() =>
                        openDialog('changePassword', {
                          userId: user.id,
                          username: user.username,
                        })
                      }
                    >
                      <KeyRound size={14} />
                    </Button>
                    <DeleteUserButton userId={user.id} username={user.username} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
