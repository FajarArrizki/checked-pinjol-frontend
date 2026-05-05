import { Button } from './Button'

type ReportAcceptedModalProps = {
  title: string
  description: string
}

export function ReportAcceptedModal({ title, description }: ReportAcceptedModalProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7FFF5] text-[#1AA86E]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </span>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary">Tutup</Button>
          <Button>Oke</Button>
        </div>
      </div>
    </section>
  )
}
