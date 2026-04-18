import { useTreeStore } from '@/stores/tree'
import { useLocation } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

export default function EditorTitleBar({ children }: Props) {
  const { pathname } = useLocation()
  const getPageByPath = useTreeStore((state) => state.getPageByPath)

  const pagePath = pathname.startsWith('/e/') ? pathname.slice(3) : pathname.slice(1)
  const page = getPageByPath(pagePath)

  return (
    <div className="flex items-center gap-2">
      {page && (
        <span className="text-sm font-heading text-foreground/80">
          Editing: {page.title}
        </span>
      )}
      {children}
    </div>
  )
}
