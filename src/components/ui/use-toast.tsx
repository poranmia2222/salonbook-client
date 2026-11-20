"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: Omit<Toast, "id">) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2, 9)
      setToasts((prev) => [...prev, { id, title, description, variant }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm flex-col gap-2 p-4 rounded-lg border shadow-lg"
            style={{
              borderColor:
                t.variant === "destructive"
                  ? "hsl(0 72% 51%)"
                  : "hsl(220 15% 20%)",
              background: "hsl(220 15% 12%)",
              color: "hsl(0 0% 96%)",
            }}
          >
            {t.title && (
              <h3 className="text-sm font-semibold">{t.title}</h3>
            )}
            {t.description && (
              <p className="text-xs text-muted-foreground">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
