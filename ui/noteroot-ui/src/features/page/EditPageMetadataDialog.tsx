import { updatePage, getPageByPath } from '@/lib/api'
import { handleFieldErrors } from '@/lib/handleFieldErrors'
import { useTreeStore } from '@/stores/tree'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormInput from '@/components/FormInput'
import FormActions from '@/components/FormActions'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  pageId: string
  currentTitle: string
  currentSlug: string
  onClose: () => void
}

export default function EditPageMetadataDialog({
  pageId,
  currentTitle,
  currentSlug,
  onClose,
}: Props) {
  const [title, setTitle] = useState(currentTitle)
  const [slug, setSlug] = useState(currentSlug)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const reloadTree = useTreeStore((state) => state.reloadTree)
  const getPageById = useTreeStore((state) => state.getPageById)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})

    try {
      const page = getPageById(pageId)
      if (!page) throw new Error('Page not found')

      const fullPage = await getPageByPath(page.path)
      await updatePage(pageId, title, slug, fullPage.content || '')
      toast.success('Page updated')
      await reloadTree()
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
          <DialogTitle>Edit Page Metadata</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="edit-meta-title"
            label="Title"
            value={title}
            onChange={setTitle}
            error={fieldErrors.title}
            required
            autoFocus
          />
          <FormInput
            id="edit-meta-slug"
            label="Slug"
            value={slug}
            onChange={setSlug}
            error={fieldErrors.slug}
            required
          />
          <FormActions onCancel={onClose} loading={loading} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
