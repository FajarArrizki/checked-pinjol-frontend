import { tokens } from '../config/tokens'

type PhotoUploadCardProps = {
  description: string
  multiple?: boolean
  onFileChange?: (files: File[]) => void
}

export function PhotoUploadCard({ description, multiple = true, onFileChange }: PhotoUploadCardProps) {
  return (
    <label
      className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-4 border border-dashed bg-white p-6 text-center transition-colors hover:bg-slate-50"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[300],
        boxShadow: tokens.shadow.sm,
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => onFileChange?.(Array.from(event.target.files ?? []))}
      />

      <span
        className="flex h-16 w-16 items-center justify-center"
        style={{
          borderRadius: tokens.radius.lg,
          backgroundColor: tokens.colors.slate[100],
          color: tokens.colors.slate[600],
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V8m0 0-3 3m3-3 3 3M4.75 15.75v1.5A1.75 1.75 0 0 0 6.5 19h11a1.75 1.75 0 0 0 1.75-1.75v-1.5"
          />
        </svg>
      </span>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium" style={{ color: tokens.colors.slate[900] }}>
          Klik untuk unggah screenshot
        </p>
        <p className="max-w-xs text-sm leading-6" style={{ color: tokens.colors.slate[500] }}>{description}</p>
      </div>
    </label>
  )
}
