export interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  colorScheme?: 'light' | 'dark';
}
