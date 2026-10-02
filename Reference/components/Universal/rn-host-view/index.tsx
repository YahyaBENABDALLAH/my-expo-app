import { WithinHostContext } from "@/components/Universal/host-context";
import {
  RNHostView as ExpoRNHostView,
  type RNHostViewProps,
} from "@expo/ui";

/**
 * Expo Universal RNHostView with the React Native Host context restored.
 * Props remain exactly Expo's RNHostViewProps.
 */
export function RNHostView({ children, ...props }: RNHostViewProps) {
  return (
    <ExpoRNHostView {...props}>
      <WithinHostContext value={false}>{children}</WithinHostContext>
    </ExpoRNHostView>
  );
}

export type { RNHostViewProps } from "@expo/ui";
