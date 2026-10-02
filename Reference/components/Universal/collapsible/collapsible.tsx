import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { useTheme } from "@/context/theme.context";
import { Collapsible as ExpoCollapsible } from "@expo/ui";
import { useContext } from "react";

import type { CollapsibleProps } from "./types";

export function Collapsible({ labelStyle, ...props }: CollapsibleProps) {
  const { tokens } = useTheme();
  const withinHost = useContext(WithinHostContext);
  const collapsibleTokens = tokens.components.collapsible;
  const collapsibleNode = (
    <ExpoCollapsible
      {...props}
      labelStyle={{
        ...tokens.typography.control.collapsibleLabel,
        color: collapsibleTokens.color.label,
        ...labelStyle,
      }}
    />
  );

  if (withinHost) {
    return collapsibleNode;
  }

  return (
    <Host
      matchContents={{ vertical: true }}
      seedColor={collapsibleTokens.color.accent}
    >
      {collapsibleNode}
    </Host>
  );
}
