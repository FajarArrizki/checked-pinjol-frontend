import { ChangeEvent } from 'react'
import { statusPillConfig, type StatusPillValue } from './config/status-pill'
import { tokens } from '../config/tokens'

type StatusDropdownProps = {
  status: StatusPillValue
  onChange: (newStatus: StatusPillValue) => void
  options?: StatusPillValue[]
}

export function StatusDropdown({ status, onChange, options = ['process', 'selesai', 'pending'] }: StatusDropdownProps) {
  const currentConfig = statusPillConfig[status] || statusPillConfig['process']

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as StatusPillValue)
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleChange}
        className="appearance-none pl-4 pr-10 py-1.5 text-sm font-medium outline-none cursor-pointer border transition-colors bg-transparent"
        style={{
          borderRadius: tokens.radius.full,
          ...currentConfig.style,
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-white text-slate-800">
            {statusPillConfig[opt].label}
          </option>
        ))}
      </select>
      <div 
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        style={{ color: currentConfig.style.color }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  )
}
