import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
  title?: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
  function add(options: Omit<Toast, 'id'>) {
    const id = ++counter
    const duration = options.duration ?? 3000

    toasts.value.push({ ...options, id })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  return {
    toasts,
    remove,
    success: (message: string, title?: string) => add({ type: 'success', message, title }),
    error: (message: string, title?: string) => add({ type: 'error', message, title }),
    warning: (message: string, title?: string) => add({ type: 'warning', message, title }),
    info: (message: string, title?: string) => add({ type: 'info', message, title }),
  }
}
