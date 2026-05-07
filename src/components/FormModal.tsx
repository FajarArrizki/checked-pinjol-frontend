import type { ReactNode } from 'react'

import { Button } from './Button'
import { inputConfig } from './config/input'
import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type FormModalProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function FormModal({ title, description, children }: FormModalProps) {
  return (
    <section className="bg-white p-6" style={{ ...surfaceConfig.card }}>
      <div className="mx-auto max-w-xl bg-white p-6" style={{ ...surfaceConfig.card }}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h2>
            {description ? <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[600] }}>{description}</p> : null}
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: tokens.colors.slate[200], color: tokens.colors.slate[500] }}
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          {children}

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 outline-none"
              style={{ ...inputConfig.fieldStyle }}
              placeholder="Input name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 outline-none"
              style={{ ...inputConfig.fieldStyle }}
              placeholder="Input email"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
    </section>
  )
}
