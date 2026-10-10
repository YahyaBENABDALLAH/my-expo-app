import { ProgressView } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';
import type { LoadingIndicatorProps } from './loading-indicator';

export function LoadingIndicator({ color, testID }: LoadingIndicatorProps) {
  return <ProgressView testID={testID} modifiers={[tint(color)]} />;
}
