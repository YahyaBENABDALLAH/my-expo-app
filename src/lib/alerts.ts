export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

export interface AlertOptions {
  variant: AlertVariant;
  message: string;
  title?: string;
}

interface AlertNotification extends AlertOptions {
  id: number;
}

let nextId = 0;
let queue: AlertNotification[] = [];
const listeners = new Set<() => void>();

export function getAlert() {
  return queue[0] ?? null;
}

export function subscribeAlerts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Queue feedback above navigation without repeating identical notifications. */
export function showAlert(options: AlertOptions) {
  const message = options.message.trim();
  if (!message) return;
  const title = options.title?.trim() || undefined;
  if (
    queue.some(
      (alert) =>
        alert.variant === options.variant && alert.message === message && alert.title === title,
    )
  ) {
    return;
  }
  queue = [...queue, { id: nextId++, variant: options.variant, message, title }];
  listeners.forEach((listener) => listener());
}

export function dismissAlert(id: number) {
  // A late native dismissal must never remove the next notification.
  if (queue[0]?.id !== id) return;
  queue = queue.slice(1);
  listeners.forEach((listener) => listener());
}
