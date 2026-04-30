import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-[min(1120px,calc(100%-32px))] py-8 max-sm:w-[min(100%-20px,1120px)]">
      <main>{children}</main>
    </div>
  )
}
