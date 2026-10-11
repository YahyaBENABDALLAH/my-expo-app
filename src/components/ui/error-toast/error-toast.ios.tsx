import { Toast } from '../toast/toast';
import type { ErrorToastProps } from './error-toast.types';

/** Compatibility component for existing error-only consumers. */
export function ErrorToast(props: ErrorToastProps) {
  return <Toast {...props} variant="error" />;
}
