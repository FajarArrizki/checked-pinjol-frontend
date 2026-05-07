import { tokens } from '../config/tokens'
import { SidebarMenuPill } from './SidebarMenuPill'

type SidebarItem = {
  label: string
  active?: boolean
  onClick?: () => void
}

type SidebarProps = {
  title?: string
  items: SidebarItem[]
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ title = 'Menu', items, collapsed = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex min-h-[calc(100vh-72px)] flex-col gap-4 border-r bg-white py-0 transition-all ${collapsed ? 'w-[72px] px-3' : 'w-full max-w-[280px] px-4'}`}
      style={{
        borderColor: tokens.colors.slate[200],
      }}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} pt-6`}>
        {!collapsed ? (
          <h2 className="text-base font-semibold" style={{ color: tokens.colors.slate[900] }}>
            {title}
          </h2>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-slate-50"
          style={{
            borderColor: tokens.colors.slate[200],
            color: tokens.colors.slate[700],
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25 15.75 12 9 18.75" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5.25 8.25 12 15 18.75" />
            )}
          </svg>
        </button>
      </div>

      {!collapsed ? (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <SidebarMenuPill
              key={item.label}
              label={item.label}
              active={item.active}
              collapsed={collapsed}
              onClick={item.onClick}
            />
          ))}
        </div>
      ) : null}
    </aside>
  )
}
