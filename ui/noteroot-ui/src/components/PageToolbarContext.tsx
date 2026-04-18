import { createContext, useContext, useState, ReactNode } from 'react'

type PageToolbarContextType = {
  content: ReactNode
  setContent: (content: ReactNode) => void
  titleBar: ReactNode
  setTitleBar: (titleBar: ReactNode) => void
}

const PageToolbarContext = createContext<PageToolbarContextType | undefined>(
  undefined,
)

export function PageToolbarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null)
  const [titleBar, setTitleBar] = useState<ReactNode>(null)

  return (
    <PageToolbarContext.Provider
      value={{ content, setContent, titleBar, setTitleBar }}
    >
      {children}
    </PageToolbarContext.Provider>
  )
}

export function usePageToolbar() {
  const context = useContext(PageToolbarContext)
  if (!context)
    throw new Error('usePageToolbar must be used within a PageToolbarProvider')
  return context
}
