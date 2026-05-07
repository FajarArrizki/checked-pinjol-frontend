import type { ReactNode } from 'react'

import { tokens } from '../config/tokens'

type PageHeaderCardProps = {
  back?: ReactNode
  title: string
  description: string
}

export function PageHeaderCard({ back, title, description }: PageHeaderCardProps) {
  return (
    <section
      className="border px-6 py-6"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        backgroundColor: '#F5FFFB',
      }}
    >
      <div className="space-y-4">
        {back ? <div>{back}</div> : null}

        <div>
          <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h1>
          <p className="mt-2 text-sm leading-6" style={{ color: tokens.colors.slate[600] }}>{description}</p>
        </div>
      </div>
    </section>
  )
}
