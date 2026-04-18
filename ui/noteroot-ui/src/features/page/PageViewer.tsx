import { getPageByPath } from '@/lib/api'
import { useTreeStore } from '@/stores/tree'
import { usePageToolbar } from '@/components/PageToolbarContext'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useDialogsStore } from '@/stores/dialogs'
import { getAncestorIds } from '@/lib/treeUtils'
import MarkdownLink from '@/components/MarkdownLink'

export default function PageViewer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { setContent, setTitleBar } = usePageToolbar()
  const tree = useTreeStore((state) => state.tree)
  const openDialog = useDialogsStore((state) => state.openDialog)

  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pagePath = pathname.slice(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPageByPath(pagePath)
        setPage(data)

        // Expand ancestors in tree
        if (tree && data?.id) {
          const ancestors = getAncestorIds(tree, data.id)
          const treeState = useTreeStore.getState()
          const current = new Set(treeState.openNodeIds)
          for (const id of ancestors) {
            current.add(id)
          }
          useTreeStore.setState({ openNodeIds: Array.from(current) })
        }
      } catch {
        setError('Page not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [pagePath, tree])

  useEffect(() => {
    if (!page) {
      setContent(null)
      setTitleBar(null)
      return
    }

    setTitleBar(null)
    setContent(
      <div className="flex items-center gap-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={() => navigate(`/e/${page.path}`)}
        >
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>
        <Button
          variant="neutral"
          size="sm"
          onClick={() =>
            openDialog('delete', {
              pageId: page.id,
              pageTitle: page.title,
              hasChildren: page.children && page.children.length > 0,
            })
          }
        >
          <Trash2 size={14} className="mr-1" />
          Delete
        </Button>
      </div>,
    )

    return () => {
      setContent(null)
      setTitleBar(null)
    }
  }, [page, navigate, openDialog, setContent, setTitleBar])

  if (loading) {
    return <div className="p-4 text-sm text-foreground/60">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600 font-heading">Error: {error}</div>
  }

  if (!page) {
    return <div className="p-4 text-sm text-foreground/60">No page found</div>
  }

  return (
    <article className="prose mx-auto max-w-4xl">
      <h1>{page.title}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: MarkdownLink,
        }}
      >
        {page.content || ''}
      </ReactMarkdown>
    </article>
  )
}
