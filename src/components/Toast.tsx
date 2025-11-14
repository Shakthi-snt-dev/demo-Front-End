import React, { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  type: ToastType
  message: string
}

type ShowToastOptions = {
  message: string
  type?: ToastType
  duration?: number
}

const ToastContext = createContext<{ showToast: (opts: ShowToastOptions) => void } | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const showToast = useCallback((opts: ShowToastOptions) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const toast: Toast = { id, type: opts.type ?? 'info', message: opts.message }
    setToasts((t) => [...t, toast])
    const duration = opts.duration ?? 4000
    setTimeout(() => remove(id), duration)
  }, [remove])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              minWidth: 220,
              maxWidth: 360,
              padding: '10px 12px',
              borderRadius: 8,
              color: '#0f172a',
              background:
                t.type === 'success'
                  ? '#d1fae5'
                  : t.type === 'error'
                  ? '#fee2e2'
                  : t.type === 'warning'
                  ? '#fef3c7'
                  : '#dbeafe',
              boxShadow: '0 6px 18px rgba(2,6,23,0.08)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize', marginBottom: 4 }}>{t.type}</div>
            <div style={{ fontSize: 14 }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
