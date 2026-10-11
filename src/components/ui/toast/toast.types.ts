import type { ToastOptions } from '@/lib/toasts';

export type { ToastVariant } from '@/lib/toasts';

export interface ToastProps extends ToastOptions {
  onDismiss: () => void;
  colorScheme?: 'light' | 'dark';
}
