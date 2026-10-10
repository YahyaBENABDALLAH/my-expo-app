import { useThemeColors } from '@/hooks/use-theme';
import {
  FieldGroup as NativeFieldGroup,
  type FieldGroupProps,
  type FieldSectionProps,
} from '@expo/ui';
import { Text, VStack } from '@expo/ui/swift-ui';
import {
  foregroundStyle,
  listRowBackground,
  listRowSeparatorTint,
  scrollContentBackground,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { isValidElement } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import { fieldSectionSlots, groupFieldChildren } from './field-group-slots';

function FieldSection({ children, title, modifiers, ...props }: FieldSectionProps) {
  const colors = useThemeColors(useHostColorScheme());
  const { header, footer, rows } = fieldSectionSlots(children);
  return (
    <NativeFieldGroup.Section
      {...props}
      modifiers={[foregroundStyle(colors.text), ...(modifiers ?? [])]}
    >
      {header != null || title ? (
        <NativeFieldGroup.SectionHeader>
          <VStack alignment="leading" modifiers={[foregroundStyle(colors.muted)]}>
            {header ?? <Text>{title}</Text>}
          </VStack>
        </NativeFieldGroup.SectionHeader>
      ) : null}
      {rows.map((row, index) => (
        <VStack
          key={isValidElement(row) ? (row.key ?? index) : index}
          alignment="leading"
          modifiers={[
            foregroundStyle(colors.text),
            listRowBackground(colors.controlSurface),
            listRowSeparatorTint(colors.divider),
          ]}
        >
          {row}
        </VStack>
      ))}
      {footer != null ? (
        <NativeFieldGroup.SectionFooter>
          <VStack alignment="leading" modifiers={[foregroundStyle(colors.muted)]}>
            {footer}
          </VStack>
        </NativeFieldGroup.SectionFooter>
      ) : null}
    </NativeFieldGroup.Section>
  );
}

export function FieldGroup({ children, style, modifiers, ...props }: FieldGroupProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeFieldGroup
      {...props}
      style={{ backgroundColor: colors.background, ...style }}
      modifiers={[
        scrollContentBackground('hidden'),
        foregroundStyle(colors.text),
        tint(colors.controlActive),
        ...(modifiers ?? []),
      ]}
    >
      {groupFieldChildren(children, FieldSection)}
    </NativeFieldGroup>
  );
}
FieldGroup.Section = FieldSection;
FieldGroup.SectionHeader = NativeFieldGroup.SectionHeader;
FieldGroup.SectionFooter = NativeFieldGroup.SectionFooter;
