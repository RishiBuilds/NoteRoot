import { useUserStore } from '@/stores/users'
import { handleFieldErrors } from '@/lib/handleFieldErrors'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FormInput from '@/components/FormInput'
import FormActions from '@/components/FormActions'
import { useState } from 'react'
import { toast } from 'sonner'
import { User } from '@/lib/api'

type Props = {
  user: User | null
  onClose: () => void
}

export default function UserFormDialog({ user, onClose }: Props) {
  const isEdit = !!user
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor'>(user?.role || 'editor')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { createUser, updateUser } = useUserStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})

    try {
      if (isEdit) {
        await updateUser({
          id: user!.id,
          username,
          email,
          role,
          ...(password ? { password } : {}),
        })
        toast.success('User updated')
      } else {
        await createUser({ username, email, password, role })
        toast.success('User created')
      }
      onClose()
    } catch (err) {
      handleFieldErrors(err, setFieldErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="user-username"
            label="Username"
            value={username}
            onChange={setUsername}
            error={fieldErrors.username}
            required
            autoFocus
          />
          <FormInput
            id="user-email"
            label="Email"
            value={email}
            onChange={setEmail}
            error={fieldErrors.email}
            required
          />
          <FormInput
            id="user-password"
            label={isEdit ? 'New Password (leave empty to keep)' : 'Password'}
            value={password}
            onChange={setPassword}
            type="password"
            error={fieldErrors.password}
            required={!isEdit}
          />
          <div className="space-y-1">
            <label className="text-sm font-heading text-foreground">Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'editor')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormActions
            onCancel={onClose}
            loading={loading}
            submitLabel={isEdit ? 'Update' : 'Create'}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
