import { useUserStore } from '@/stores/users'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormInput from '@/components/FormInput'
import FormActions from '@/components/FormActions'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  onClose: () => void
}

export default function ChangeOwnPasswordDialog({ onClose }: Props) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { changeOwnPassword } = useUserStore()

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
      await changeOwnPassword(oldPassword, newPassword)
      toast.success('Password changed')
      onClose()
    } catch {
      setError('Failed to change password. Check your current password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <FormInput
            id="change-old-password"
            label="Current Password"
            value={oldPassword}
            onChange={setOldPassword}
            type="password"
            required
            autoFocus
          />
          <FormInput
            id="change-new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
            required
          />
          <FormInput
            id="change-confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            required
          />
          <FormActions onCancel={onClose} loading={loading} submitLabel="Change Password" />
        </form>
      </DialogContent>
    </Dialog>
  )
}
