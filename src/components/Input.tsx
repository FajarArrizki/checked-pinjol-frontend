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
          w-full px-4 py-3
          text-sm placeholder:text-slate-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:bg-white focus:shadow-sm
          hover:border-slate-300
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400
          ${error ? 'focus:ring-red-400 border-red-400' : ''}
          ${className}
        `.trim()}
        style={{
          ...inputConfig.fieldStyle,
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
