import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

type ToastVariant = 'error'

type ToastItem = {
  id: number
  title: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (options: { title: string; variant?: ToastVariant }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, variant = 'error' }: { title: string; variant?: ToastVariant }) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)

      setToasts((current) => [...current, { id, title, variant }])
      window.setTimeout(() => removeToast(id), 4000)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((item) => (
          <div className={`toast toast--${item.variant}`} key={item.id} role="status">
            <p>{item.title}</p>
            <button
              aria-label="Fechar notificacao"
              className="toast__close"
              type="button"
              onClick={() => removeToast(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
