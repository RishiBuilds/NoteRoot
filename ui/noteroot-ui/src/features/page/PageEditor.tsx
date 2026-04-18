import { getPageByPath, updatePage } from '@/lib/api'
import { useTreeStore } from '@/stores/tree'
import { usePageToolbar } from '@/components/PageToolbarContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import EditorTitleBar from '@/components/EditorTitleBar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import MarkdownLink from '@/components/MarkdownLink'

export default function PageEditor() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { setContent, setTitleBar } = usePageToolbar()
  const reloadTree = useTreeStore((state) => state.reloadTree)

  const [page, setPage] = useState<any>(null)
  const [content, setEditorContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const pagePath = pathname.slice(3) // remove /e/

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPageByPath(pagePath)
        setPage(data)
        setEditorContent(data.content || '')
        setHasChanges(false)
      } catch {
        setError('Page not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [pagePath])

  const handleSave = useCallback(async () => {
    if (!page || saving) return
    setSaving(true)
    try {
      await updatePage(page.id, page.title, page.slug, content)
      setHasChanges(false)
      toast.success('Page saved')
      await reloadTree()
    } catch {
      toast.error('Failed to save page')
    } finally {
      setSaving(false)
    }
  }, [page, content, saving, reloadTree])

  // Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  useEffect(() => {
    if (!page) {
      setContent(null)
      setTitleBar(null)
      return
    }

    setTitleBar(
      <EditorTitleBar>
        <span />
      </EditorTitleBar>,
    )
    setContent(
      <div className="flex items-center gap-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={() => navigate(`/${page.path}`)}
        >
          <ArrowLeft size={14} className="mr-1" />
          Back
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
          <Save size={14} className="mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>,
    )

    return () => {
      setContent(null)
      setTitleBar(null)
    }
  }, [page, saving, hasChanges, navigate, handleSave, setContent, setTitleBar])

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
    <div className="flex h-full gap-0">
      {/* Editor pane */}
      <div className="flex flex-1 flex-col border-r-2 border-border">
        <div className="border-b-2 border-border bg-background px-4 py-2 text-xs font-heading uppercase tracking-wide text-foreground/60">
          Markdown
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setEditorContent(e.target.value)
            setHasChanges(true)
          }}
          className="flex-1 resize-none p-4 font-mono text-sm outline-none"
          placeholder="Start writing..."
          spellCheck={false}
        />
      </div>

      {/* Preview pane */}
      <div className="flex flex-1 flex-col">
        <div className="border-b-2 border-border bg-background px-4 py-2 text-xs font-heading uppercase tracking-wide text-foreground/60">
          Preview
        </div>
        <div className="flex-1 overflow-auto p-4">
          <article className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: MarkdownLink,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  )
}
