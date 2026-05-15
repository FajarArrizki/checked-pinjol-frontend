import { tokens } from '../config/tokens'

type LegalityResultCardProps = {
  name: string
  found: boolean
  status?: string
  website?: string
  alamat?: string
  tahunBerdiri?: string | number
  message: string
}

export function LegalityResultCard({ name, found, status, website, alamat, tahunBerdiri, message }: LegalityResultCardProps) {
  const isSafe = found && status !== 'ilegal'

  return (
    <div
      className="flex flex-col gap-4 border bg-white p-6 shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: isSafe ? tokens.colors.brand.soft : tokens.colors.danger.soft,
        boxShadow: tokens.shadow.sm,
        backgroundColor: isSafe ? tokens.colors.brand.softStrong : tokens.colors.danger.soft,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Hasil Pencarian</p>
          <h3 className="text-2xl font-bold" style={{ color: isSafe ? tokens.colors.brand.dark : tokens.colors.danger.dark }}>
            {isSafe ? 'Aman / Legal' : 'Berbahaya / Ilegal'}
          </h3>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tokens.colors.white, color: tokens.colors.slate[700] }}>
          {name}
        </span>
      </div>

      <p className="text-sm leading-6" style={{ color: tokens.colors.slate[700] }}>{message}</p>

      {found && (
        <div className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2" style={{ borderColor: tokens.colors.slate[200] }}>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>Status</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{status ?? '-'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>Tahun Berdiri</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{tahunBerdiri ?? '-'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>Website</p>
            <p className="mt-1 break-all text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{website ?? '-'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>Alamat</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{alamat ?? '-'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
