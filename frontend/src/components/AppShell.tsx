import type { PropsWithChildren } from 'react'
import { AppFooter } from './AppFooter'
import { AppHeader } from './AppHeader'

type AppShellProps = PropsWithChildren<{
  title?: string
  subtitle?: string
  dimmed?: boolean
  footerVariant?: 'compact' | 'full'
  pageVariant?: 'default' | 'enrollment'
}>

export function AppShell({
  children,
  title,
  subtitle,
  dimmed = false,
  footerVariant = 'full',
  pageVariant = 'default',
}: AppShellProps) {
  return (
    <div
      className={`page-shell${dimmed ? ' page-shell--dimmed' : ''}${
        pageVariant === 'enrollment' ? ' page-shell--enrollment' : ''
      }`}
    >
      <AppHeader title={title} subtitle={subtitle} />
      <main className="page-content">{children}</main>
      <AppFooter variant={footerVariant} />
    </div>
  )
}
