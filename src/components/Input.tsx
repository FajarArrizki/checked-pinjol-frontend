import type { InputHTMLAttributes } from 'react'

import { inputConfig } from './config/input'
import { tokens } from '../config/tokens'

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
        <label className="text-sm font-medium" style={{ color: inputConfig.labelColor }}>{label}</label>
      )}
      <input
        className={`
          w-full px-4 py-2
          text-sm placeholder:text-slate-400
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
          disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400
          ${error ? 'focus:ring-red-400' : ''}
          ${className}
        `.trim()}
        style={{
          ...inputConfig.fieldStyle,
          borderRadius: tokens.radius.sm,
          ...(error ? inputConfig.errorStyle : {}),
        }}
        {...props}
      />
      {error && (
        <span className="text-xs" style={{ color: inputConfig.errorColor }}>{error}</span>
      )}
    </div>
  )
}
