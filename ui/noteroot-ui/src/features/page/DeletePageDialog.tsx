import { deletePage } from '@/lib/api'
import { useTreeStore } from '@/stores/tree'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type Props = {
  pageId: string
  pageTitle: string
  hasChildren: boolean
  onClose: () => void
}

export default function DeletePageDialog({
  pageId,
  pageTitle,
  hasChildren,
  onClose,
}: Props) {
  const [recursive, setRecursive] = useState(false)
  const [loading, setLoading] = useState(false)
  const reloadTree = useTreeStore((state) => state.reloadTree)
  const navigate = useNavigate()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deletePage(pageId, recursive)
      toast.success('Page deleted')
      await reloadTree()
      onClose()
      navigate('/')
    } catch {
      toast.error('Failed to delete page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{pageTitle}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The page will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasChildren && (
          <div className="flex items-center gap-2 rounded-base border-2 border-border bg-yellow-50 p-3">
            <Checkbox
              id="delete-recursive"
              checked={recursive}
              onCheckedChange={(v) => setRecursive(v === true)}
            />
            <label
              htmlFor="delete-recursive"
              className="text-sm font-base text-foreground"
            >
              Also delete all child pages
            </label>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading || (hasChildren && !recursive)}
            className="bg-red-500 text-white border-border hover:bg-red-600"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
