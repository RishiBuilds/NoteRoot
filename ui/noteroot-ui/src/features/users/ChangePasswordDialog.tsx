import { updateUser } from '@/lib/api'
import { useUserStore } from '@/stores/users'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormInput from '@/components/FormInput'
import FormActions from '@/components/FormActions'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  userId: string
  username: string
  onClose: () => void
}

export default function ChangePasswordDialog({ userId, username, onClose }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loadUsers } = useUserStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    setLoading(true)
    try {
      // Get user data from store to pass all required fields
      const users = useUserStore.getState().users
      const user = users.find((u) => u.id === userId)
      if (!user) throw new Error('User not found')

      await updateUser({ ...user, password: newPassword })
      toast.success(`Password for ${username} changed`)
      await loadUsers()
      onClose()
    } catch {
      setError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password for {username}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <FormInput
            id="admin-new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
            required
            autoFocus
          />
          <FormInput
            id="admin-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            required
          />
          <FormActions onCancel={onClose} loading={loading} submitLabel="Set Password" />
        </form>
      </DialogContent>
    </Dialog>
  )
}
