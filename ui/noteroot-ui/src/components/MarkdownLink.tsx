import { Link } from 'react-router-dom'

export default function MarkdownLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  const href = props.href || ''

  // Internal wiki links — relative paths without protocol
  const isInternal = href && !href.startsWith('http') && !href.startsWith('//')

  if (isInternal) {
    return (
      <Link to={href} className="text-blue-600 hover:underline">
        {props.children}
      </Link>
    )
  }

  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {props.children}
    </a>
  )
}
