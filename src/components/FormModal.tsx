import type { ReactNode } from 'react'

import { Button } from './Button'

type FormModalProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function FormModal({ title, description, children }: FormModalProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500"
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          {children}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400"
              placeholder="Input name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400"
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
