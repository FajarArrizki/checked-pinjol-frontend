import { Button } from './Button'

type ReportRejectedModalProps = {
  title: string
  description: string
}

export function ReportRejectedModal({ title, description }: ReportRejectedModalProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </span>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary">Kembali</Button>
          <Button variant="danger">Tutup Laporan</Button>
        </div>
      </div>
    </section>
  )
}
