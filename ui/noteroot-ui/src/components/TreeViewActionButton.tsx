import { TooltipWrapper } from '@/components/TooltipWrapper'

type Props = {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
}

export function TreeViewActionButton({ icon, tooltip, onClick }: Props) {
  return (
    <TooltipWrapper label={tooltip}>
      <button
        className="rounded-base p-1 transition-colors hover:bg-main/20"
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {icon}
      </button>
    </TooltipWrapper>
  )
}
