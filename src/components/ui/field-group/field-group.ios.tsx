import { FieldGroup as NativeFieldGroup, type FieldGroupProps } from '@expo/ui';
import { scrollContentBackground } from '@expo/ui/swift-ui/modifiers';

/** Honor an explicit form background, including transparent settings screens. */
export function FieldGroup({ style, modifiers, ...props }: FieldGroupProps) {
  return (
    <NativeFieldGroup
      {...props}
      style={style}
      modifiers={
        style?.backgroundColor === undefined
          ? modifiers
          : [scrollContentBackground('hidden'), ...(modifiers ?? [])]
      }
    />
  );
}
FieldGroup.Section = NativeFieldGroup.Section;
FieldGroup.SectionHeader = NativeFieldGroup.SectionHeader;
FieldGroup.SectionFooter = NativeFieldGroup.SectionFooter;

export type { FieldGroupProps } from '@expo/ui';
