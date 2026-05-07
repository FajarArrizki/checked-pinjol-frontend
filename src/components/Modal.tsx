import { type ReactNode, useEffect } from 'react'
import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-white p-6 shadow-xl"
        style={{ 
          ...surfaceConfig.card,
          animation: 'modalSlideUp 0.3s ease-out forwards'
        }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h2>
            {description ? <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[600] }}>{description}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
