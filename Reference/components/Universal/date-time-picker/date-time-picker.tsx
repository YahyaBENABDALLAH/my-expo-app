import { useTheme } from "@/context/theme.context";
import ExpoDateTimePicker, {
  type DateTimePickerProps,
} from "@expo/ui/community/datetime-picker";

/**
 * Expo's drop-in DateTimePicker with shared primary tint and color scheme.
 * Its props remain exactly Expo's DateTimePickerProps.
 */
export function DateTimePicker({
  accentColor,
  themeVariant,
  ...props
}: DateTimePickerProps) {
  const { colorScheme, tokens } = useTheme();

  return (
    <ExpoDateTimePicker
      {...props}
      accentColor={
        accentColor ?? tokens.components.dateTimePicker.color.accent
      }
      themeVariant={themeVariant ?? colorScheme}
    />
  );
}
