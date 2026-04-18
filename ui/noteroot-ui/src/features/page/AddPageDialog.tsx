import { createPage, suggestSlug } from '@/lib/api'
import { handleFieldErrors } from '@/lib/handleFieldErrors'
import { useTreeStore } from '@/stores/tree'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormInput from '@/components/FormInput'
import FormActions from '@/components/FormActions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type Props = {
  parentId: string | null
  onClose: () => void
}

export default function AddPageDialog({ parentId, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const reloadTree = useTreeStore((state) => state.reloadTree)
  const navigate = useNavigate()

  useEffect(() => {
    if (title.length < 2) return

    const timeout = setTimeout(async () => {
      try {
        const suggested = await suggestSlug(parentId || '', title)
        setSlug(suggested)
      } catch {
        // ignore
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [title, parentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})

    try {
      const page = await createPage({ title, slug, parentId })
      toast.success('Page created')
      await reloadTree()
      onClose()
      navigate(`/${page.path}`)
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
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="add-page-title"
            label="Title"
            value={title}
            onChange={setTitle}
            error={fieldErrors.title}
            required
            autoFocus
          />
          <FormInput
            id="add-page-slug"
            label="Slug"
            value={slug}
            onChange={setSlug}
            error={fieldErrors.slug}
            required
          />
          <FormActions onCancel={onClose} loading={loading} submitLabel="Create" />
        </form>
      </DialogContent>
    </Dialog>
  )
}
