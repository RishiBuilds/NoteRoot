import TreeView from '@/features/tree/TreeView'
import { useDialogsStore } from '@/stores/dialogs'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const openDialog = useDialogsStore((state) => state.openDialog)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-heading text-foreground">🌳 NoteRoot</h2>
        <Button
          variant="neutral"
          size="icon"
          onClick={() => openDialog('add', { parentId: null })}
          title="Create root page"
        >
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <TreeView />
      </div>
    </div>
  )
}
