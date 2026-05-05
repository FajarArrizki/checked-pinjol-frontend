import type { InputHTMLAttributes } from 'react'

import { inputConfig } from './config/input'
import { tokens } from '../config/tokens'

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export function SearchBar({ className = '', ...props }: SearchBarProps) {
  return (
    <div
      className={`flex h-10 w-full max-w-xs items-center gap-2 px-3 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-slate-900 ${className}`.trim()}
      style={{
        ...inputConfig.fieldStyle,
        borderRadius: tokens.radius.sm,
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ color: inputConfig.placeholderColor }}>
        <svg
          className="h-4 w-4"
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
        className="w-full bg-transparent text-sm outline-none"
        style={{
          color: inputConfig.fieldStyle.color,
        }}
        {...props}
      />
    </div>
  )
}
