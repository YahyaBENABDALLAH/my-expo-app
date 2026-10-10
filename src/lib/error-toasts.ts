import { isAxiosError } from 'axios';
import { SessionChangedError } from '@/services/auth/auth.errors';
import { getAuthErrorMessage } from '@/services/auth/auth.service';
import i18n from '@/lib/i18n';

export interface ErrorToast {
  id: number;
  message: string;
}

let nextId = 0;
let queue: ErrorToast[] = [];
const listeners = new Set<() => void>();

export function getErrorToast() {
  return queue[0] ?? null;
}

export function subscribeErrorToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Shared by cache callbacks and imperative auth work; contains no rendering code. */
export function reportErrorToast(error: unknown) {
  if (
    error instanceof SessionChangedError ||
    (isAxiosError(error) && error.code === 'ERR_CANCELED') ||
    (error instanceof Error && error.name === 'AbortError')
  ) {
    return;
  }
  const message = getAuthErrorMessage(error).trim() || i18n.t('auth.requestFailed');
  // Parallel failed reads and nested callbacks should not repeat the same visible message.
  if (queue.some((toast) => toast.message === message)) return;
  queue = [...queue, { id: nextId++, message }];
  listeners.forEach((listener) => listener());
}

export function dismissErrorToast(id: number) {
  // A late native dismissal must never remove the next notification.
  if (queue[0]?.id !== id) return;
  queue = queue.slice(1);
  listeners.forEach((listener) => listener());
}
