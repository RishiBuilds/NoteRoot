import { useTreeStore } from '@/stores/tree'
import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const getPageByPath = useTreeStore((state) => state.getPageByPath)

  // Editor mode: strip /e/ prefix
  const isEditor = pathname.startsWith('/e/')
  const pagePath = isEditor ? pathname.slice(3) : pathname.slice(1)

  if (!pagePath || pagePath === '') {
    return (
      <nav className="flex items-center gap-1 text-sm text-foreground/60">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-main font-heading"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
      </nav>
    )
  }

  const segments = pagePath.split('/')
  const breadcrumbs: { label: string; path: string }[] = []

  for (let i = 0; i < segments.length; i++) {
    const fullPath = segments.slice(0, i + 1).join('/')
    const node = getPageByPath(fullPath)
    breadcrumbs.push({
      label: node?.title ?? segments[i],
      path: isEditor ? `/e/${fullPath}` : `/${fullPath}`,
    })
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-foreground/60">
      <Link to="/" className="flex items-center gap-1 hover:text-main">
        <Home size={14} />
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {i === breadcrumbs.length - 1 ? (
            <span className="font-heading text-foreground">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-main">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
