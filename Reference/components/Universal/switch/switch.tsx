import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { useTheme } from "@/context/theme.context";
import {
  Switch as ExpoSwitch,
  type SwitchProps,
} from "@expo/ui";
import { useContext } from "react";

/** Exact Expo Universal Switch with an automatic native Host boundary. */
export function Switch(props: SwitchProps) {
  const { tokens } = useTheme();
  const withinHost = useContext(WithinHostContext);
  const switchNode = <ExpoSwitch {...props} />;

  if (withinHost) return switchNode;

  return (
    <Host
      matchContents
      seedColor={tokens.components.switch.color.accent}
    >
      {switchNode}
    </Host>
  );
}
