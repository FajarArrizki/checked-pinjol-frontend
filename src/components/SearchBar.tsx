import type { InputHTMLAttributes } from 'react'

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export function SearchBar({ className = '', ...props }: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
          />
        </svg>
      </span>
      <input
        type="search"
        className={`
          w-full rounded-xl border border-slate-300 bg-white
          pl-9 pr-4 py-2 text-sm text-slate-900
          placeholder:text-slate-400 transition-colors
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
        `.trim()}
        {...props}
      />
    </div>
  )
}