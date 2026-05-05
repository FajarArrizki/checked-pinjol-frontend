import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}
      <input
        className={`
          w-full rounded-xl border border-slate-300 bg-white px-4 py-2
          text-sm text-slate-900 placeholder:text-slate-400
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
          disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}