import { sortPages, PageNode } from '@/lib/api'
import { useTreeStore } from '@/stores/tree'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormActions from '@/components/FormActions'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  parent: PageNode
  onClose: () => void
}

export default function SortPagesDialog({ parent, onClose }: Props) {
  const [items, setItems] = useState([...(parent.children || [])])
  const [loading, setLoading] = useState(false)
  const reloadTree = useTreeStore((state) => state.reloadTree)

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    setItems(newItems)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setItems(newItems)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await sortPages(parent.id, items.map((i) => i.id))
      toast.success('Pages sorted')
      await reloadTree()
      onClose()
    } catch {
      toast.error('Failed to sort pages')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sort Pages in &quot;{parent.title}&quot;</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background p-2"
            >
              <GripVertical size={16} className="text-foreground/40" />
              <span className="flex-1 text-sm">{item.title}</span>
              <button
                className="rounded-base p-1 hover:bg-main/20"
                onClick={() => moveUp(index)}
                disabled={index === 0}
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="rounded p-1 hover:bg-gray-100"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
              >
                <ArrowDown size={14} />
              </button>
            </div>
          ))}
        </div>
        <FormActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save Order"
        />
      </DialogContent>
    </Dialog>
  )
}
