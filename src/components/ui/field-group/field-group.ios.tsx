import { FieldGroup as NativeFieldGroup, type FieldGroupProps } from '@expo/ui';
import {
  listRowBackground,
  scrollContentBackground,
  scrollIndicators,
} from '@expo/ui/swift-ui/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

/** Honor an explicit form background, including transparent settings screens. */
export function FieldGroup({ style, modifiers, ...props }: FieldGroupProps) {
  return (
    <NativeFieldGroup
      {...props}
      style={style}
      modifiers={[
        scrollIndicators('never'),
        ...(style?.backgroundColor === undefined ? [] : [scrollContentBackground('hidden')]),
        ...(modifiers ?? []),
      ]}
    />
  );
}
FieldGroup.Section = function Section({
  modifiers,
  ...props
}: Parameters<typeof NativeFieldGroup.Section>[0]) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeFieldGroup.Section
      {...props}
      modifiers={[listRowBackground(colors.surface), ...(modifiers ?? [])]}
    />
  );
};
FieldGroup.SectionHeader = NativeFieldGroup.SectionHeader;
FieldGroup.SectionFooter = NativeFieldGroup.SectionFooter;

export type { FieldGroupProps } from '@expo/ui';
