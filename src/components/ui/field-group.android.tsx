import { useThemeColors } from '@/hooks/use-theme';
import {
  Column as UniversalColumn,
  FieldGroup as NativeFieldGroup,
  type FieldGroupProps,
  type FieldSectionProps,
} from '@expo/ui';
import { Column, LazyColumn, ListItem, Text } from '@expo/ui/jetpack-compose';
import { clip, fillMaxWidth, padding, Shapes } from '@expo/ui/jetpack-compose/modifiers';
import { useHostColorScheme } from './universal-host';
import { fieldSectionSlots, groupFieldChildren } from './field-group-slots';

function FieldSection({ children, title, titleUppercase = false, ...props }: FieldSectionProps) {
  const colors = useThemeColors(useHostColorScheme());
  const { header, footer, rows } = fieldSectionSlots(children);
  const heading =
    header ??
    (title ? (
      <Text
        color={colors.muted}
        style={{ typography: 'titleMedium', letterSpacing: titleUppercase ? 0.5 : undefined }}
      >
        {titleUppercase ? title.toUpperCase() : title}
      </Text>
    ) : null);
  return (
    <UniversalColumn {...props} spacing={4}>
      {heading != null ? <Column modifiers={[padding(16, 0, 16, 8)]}>{heading}</Column> : null}
      <Column verticalArrangement={{ spacedBy: 2 }} modifiers={[fillMaxWidth()]}>
        {rows.map((row, index) => (
          <ListItem
            key={isRowKey(row, index)}
            colors={{
              containerColor: colors.controlSurface,
              contentColor: colors.text,
              supportingContentColor: colors.muted,
            }}
            modifiers={[
              fillMaxWidth(),
              clip(
                Shapes.RoundedCorner({
                  topStart: index === 0 ? 20 : 4,
                  topEnd: index === 0 ? 20 : 4,
                  bottomStart: index === rows.length - 1 ? 20 : 4,
                  bottomEnd: index === rows.length - 1 ? 20 : 4,
                }),
              ),
            ]}
          >
            <ListItem.HeadlineContent>{row}</ListItem.HeadlineContent>
          </ListItem>
        ))}
      </Column>
      {footer != null ? <Column modifiers={[padding(16, 4, 16, 0)]}>{footer}</Column> : null}
    </UniversalColumn>
  );
}

// React keys from fragments remain stable when conditional rows change.
function isRowKey(row: import('react').ReactNode, index: number) {
  return typeof row === 'object' && row != null && 'key' in row ? (row.key ?? index) : index;
}

export function FieldGroup({ children, style, ...props }: FieldGroupProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <UniversalColumn {...props} style={{ backgroundColor: colors.background, ...style }}>
      <LazyColumn
        verticalArrangement={{ spacedBy: 24 }}
        contentPadding={{ start: 16, end: 16, top: 16, bottom: 16 }}
        modifiers={[fillMaxWidth()]}
      >
        {groupFieldChildren(children, FieldSection)}
      </LazyColumn>
    </UniversalColumn>
  );
}
FieldGroup.Section = FieldSection;
FieldGroup.SectionHeader = NativeFieldGroup.SectionHeader;
FieldGroup.SectionFooter = NativeFieldGroup.SectionFooter;
