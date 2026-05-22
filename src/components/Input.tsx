import { useState, type InputHTMLAttributes } from 'react'

import { inputConfig } from './config/input'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  prefix?: string
}

export function Input({
  label,
  error,
  prefix,
  className = '',
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = props.type === 'password'
  const resolvedType = isPasswordField ? (isPasswordVisible ? 'text' : 'password') : props.type

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium" style={{ color: inputConfig.labelColor }}>{label}</label>
      )}
      <div className="relative w-full">
        <input
          className={`
            w-full px-4 py-3
            text-sm placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:bg-white focus:shadow-sm
            hover:border-slate-300
            disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400
            ${prefix ? 'pl-12' : ''}
            ${isPasswordField ? 'pr-12' : ''}
            ${error ? 'focus:ring-red-400 border-red-400' : ''}
            ${className}
          `.trim()}
          style={{
            ...inputConfig.fieldStyle,
            ...(error ? inputConfig.errorStyle : {}),
          }}
          {...props}
          type={resolvedType}
        />

        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-4 text-sm font-medium text-slate-500">
            {prefix}
          </span>
        ) : null}

        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-slate-400 transition-colors hover:text-slate-600"
            aria-label={isPasswordVisible ? 'Sembunyikan password' : 'Lihat password'}
          >
            {isPasswordVisible ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A3 3 0 0013.42 13.42" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A9.77 9.77 0 0112 4.88c4.5 0 8.27 2.94 9.54 7.12a9.78 9.78 0 01-4.29 5.43M6.23 6.23A9.76 9.76 0 002.46 12c.62 2.06 1.93 3.86 3.77 5.14" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.46 12C3.73 7.82 7.5 4.88 12 4.88S20.27 7.82 21.54 12C20.27 16.18 16.5 19.12 12 19.12S3.73 16.18 2.46 12Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {error && (
        <span className="text-xs" style={{ color: inputConfig.errorColor }}>{error}</span>
      )}
    </div>
  )
}
