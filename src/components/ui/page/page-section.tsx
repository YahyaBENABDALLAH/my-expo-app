import { Column, type ColumnProps } from '@expo/ui';
import { spacing } from '@/constants/layout';
import {
  nativeFillWidth,
  nativeFillWidthCenter,
  nativeFillWidthEnd,
} from '../native/native-fill-width';

const sectionAlignment = {
  start: nativeFillWidth,
  center: nativeFillWidthCenter,
  end: nativeFillWidthEnd,
};

/** A content section owns its spacing; its screen stays edge-to-edge. */
export function PageSection({
  children,
  inset = true,
  spacing: itemSpacing = spacing.lg,
  alignment = 'start',
  style,
  testID,
}: Pick<ColumnProps, 'children' | 'spacing' | 'alignment' | 'style' | 'testID'> & {
  /** Full-width rails and tinted sections supply their own horizontal insets. */
  inset?: boolean;
}) {
  return (
    <Column
      spacing={itemSpacing}
      alignment={alignment}
      modifiers={sectionAlignment[alignment]}
      style={{
        paddingHorizontal: inset ? spacing.lg : spacing.none,
        paddingVertical: spacing.lg,
        ...style,
      }}
      testID={testID}
    >
      {children}
    </Column>
  );
}
