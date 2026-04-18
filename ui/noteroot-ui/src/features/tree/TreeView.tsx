import { useTreeStore } from '@/stores/tree'
import { useDebounce } from '@/lib/useDebounce'
import { filterTreeWithOpenNodes } from '@/lib/treeUtils'
import { TreeNode } from './TreeNode'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo } from 'react'

export default function TreeView() {
  const {
    tree,
    loading,
    error,
    reloadTree,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useTreeStore()

  const debouncedSearchQuery = useDebounce(searchQuery, 200)

  useEffect(() => {
    reloadTree()
  }, [reloadTree])

  const { filtered, expandedIds } = useMemo(() => {
    if (!debouncedSearchQuery) {
      return { filtered: tree, expandedIds: [] }
    }
    return filterTreeWithOpenNodes(tree, debouncedSearchQuery)
  }, [tree, debouncedSearchQuery])

  // When searching, temporarily expand matching nodes
  useEffect(() => {
    if (debouncedSearchQuery && expandedIds.length > 0) {
      const treeStore = useTreeStore.getState()
      const current = new Set(treeStore.openNodeIds)
      for (const id of expandedIds) {
        current.add(id)
      }
      useTreeStore.setState({ openNodeIds: Array.from(current) })
    }
  }, [expandedIds, debouncedSearchQuery])

  if (loading && !tree) {
    return (
      <div className="p-4 text-sm text-foreground/60">Loading...</div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 font-heading">Error: {error}</div>
    )
  }

  const displayTree = debouncedSearchQuery ? filtered : tree

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <Input
          id="tree-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pages..."
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
            onClick={clearSearch}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {displayTree ? (
        <div>
          {displayTree.children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      ) : (
        debouncedSearchQuery && (
          <div className="p-4 text-sm text-foreground/60">
            No pages found matching &quot;{debouncedSearchQuery}&quot;
          </div>
        )
      )}
    </div>
  )
}
