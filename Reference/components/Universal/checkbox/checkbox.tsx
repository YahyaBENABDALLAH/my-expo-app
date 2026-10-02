import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { Checkbox as ExpoCheckbox } from "@expo/ui";
import { useContext } from "react";

import type { CheckboxProps } from "./types";

export function Checkbox(props: CheckboxProps) {
  const withinHost = useContext(WithinHostContext);
  const checkboxNode = <ExpoCheckbox {...props} />;

  if (withinHost) {
    return checkboxNode;
  }

  return (
    <Host matchContents>{checkboxNode}</Host>
  );
}
