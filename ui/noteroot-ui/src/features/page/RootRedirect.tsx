import { useTreeStore } from '@/stores/tree'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RootRedirect() {
  const tree = useTreeStore((state) => state.tree)
  const navigate = useNavigate()

  useEffect(() => {
    if (tree && tree.children && tree.children.length > 0) {
      navigate(`/${tree.children[0].path}`, { replace: true })
    }
  }, [tree, navigate])

  return (
    <div className="flex items-center justify-center p-8 text-foreground/60 font-base">
      <span>Loading...</span>
    </div>
  )
}
