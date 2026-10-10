import { useThemeColors } from '@/hooks/use-theme';
import { Text, type CollapsibleProps } from '@expo/ui';
import { DisclosureGroup } from '@expo/ui/swift-ui';
import { background, foregroundStyle, tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';

export function Collapsible({
  isOpen,
  onOpenChange,
  label = '',
  labelStyle,
  children,
}: CollapsibleProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <DisclosureGroup
      isExpanded={isOpen}
      onIsExpandedChange={onOpenChange}
      modifiers={[
        background(isOpen ? colors.surface : colors.controlSurface),
        foregroundStyle(colors.text),
        tint(colors.controlActive),
      ]}
    >
      <DisclosureGroup.Label>
        <Text textStyle={{ color: colors.text, ...labelStyle }}>{label}</Text>
      </DisclosureGroup.Label>
      {children}
    </DisclosureGroup>
  );
}
