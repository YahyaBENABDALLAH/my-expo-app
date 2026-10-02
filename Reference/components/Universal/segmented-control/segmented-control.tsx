import { useTheme } from "@/context/theme.context";
import ExpoSegmentedControl, {
  type SegmentedControlProps,
} from "@expo/ui/community/segmented-control";

/**
 * Expo's drop-in SegmentedControl with shared primary tint and color scheme.
 * Its props remain exactly Expo's SegmentedControlProps.
 */
export function SegmentedControl({
  appearance,
  tintColor,
  ...props
}: SegmentedControlProps) {
  const { colorScheme, tokens } = useTheme();

  return (
    <ExpoSegmentedControl
      {...props}
      appearance={appearance ?? colorScheme}
      tintColor={
        tintColor ?? tokens.components.segmentedControl.color.accent
      }
    />
  );
}
