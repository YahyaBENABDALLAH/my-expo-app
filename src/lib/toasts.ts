export type ToastVariant = 'error' | 'success' | 'warning' | 'info';

export interface ToastOptions {
  variant: ToastVariant;
  message: string;
  title?: string;
}

export interface ToastNotification extends ToastOptions {
  id: number;
}

let nextId = 0;
let queue: ToastNotification[] = [];
const listeners = new Set<() => void>();

export function getToast() {
  return queue[0] ?? null;
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Queue feedback above navigation without repeating identical notifications. */
export function showToast(options: ToastOptions) {
  const message = options.message.trim();
  if (!message) return;
  const title = options.title?.trim() || undefined;
  if (
    queue.some(
      (toast) =>
        toast.variant === options.variant && toast.message === message && toast.title === title,
    )
  ) {
    return;
  }
  queue = [...queue, { id: nextId++, variant: options.variant, message, title }];
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: number) {
  // A late native dismissal must never remove the next notification.
  if (queue[0]?.id !== id) return;
  queue = queue.slice(1);
  listeners.forEach((listener) => listener());
}
