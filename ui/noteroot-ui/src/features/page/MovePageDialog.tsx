import { movePage, PageNode } from '@/lib/api'
import { useTreeStore } from '@/stores/tree'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FormActions from '@/components/FormActions'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  pageId: string
  onClose: () => void
}

export default function MovePageDialog({ pageId, onClose }: Props) {
  const [targetParentId, setTargetParentId] = useState<string>('root')
  const [loading, setLoading] = useState(false)
  const tree = useTreeStore((state) => state.tree)
  const reloadTree = useTreeStore((state) => state.reloadTree)

  const flatPages = useMemo(() => {
    const result: { id: string; title: string; depth: number }[] = []
    result.push({ id: 'root', title: '(Root)', depth: 0 })

    const collect = (node: PageNode, depth: number) => {
      if (node.id !== pageId) {
        result.push({ id: node.id, title: node.title, depth })
        for (const child of node.children || []) {
          collect(child, depth + 1)
        }
      }
    }

    if (tree) {
      for (const child of tree.children || []) {
        collect(child, 1)
      }
    }
    return result
  }, [tree, pageId])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await movePage(pageId, targetParentId === 'root' ? null : targetParentId)
      toast.success('Page moved')
      await reloadTree()
      onClose()
    } catch {
      toast.error('Failed to move page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-heading text-foreground">
              New Parent
            </label>
            <Select value={targetParentId} onValueChange={setTargetParentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent..." />
              </SelectTrigger>
              <SelectContent>
                {flatPages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {'  '.repeat(p.depth)}{p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormActions
            onCancel={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Move"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
