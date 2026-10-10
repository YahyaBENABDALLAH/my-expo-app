import { FieldGroup as NativeFieldGroup, type FieldSectionProps } from '@expo/ui';
import { isValidElement, type ComponentType, type ReactNode } from 'react';
import { flattenNativeChildren } from './native-children';

export function fieldSectionSlots(children: ReactNode) {
  let header: ReactNode;
  let footer: ReactNode;
  const rows: ReactNode[] = [];
  for (const child of flattenNativeChildren(children)) {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === NativeFieldGroup.SectionHeader
    )
      header = child.props.children;
    else if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === NativeFieldGroup.SectionFooter
    )
      footer = child.props.children;
    else rows.push(child);
  }
  return { header, footer, rows };
}

/** Consecutive direct rows form a section; explicit sections keep their position. */
export function groupFieldChildren(children: ReactNode, Section: ComponentType<FieldSectionProps>) {
  const groups: ReactNode[] = [];
  let rows: ReactNode[] = [];
  const flush = () => {
    if (rows.length) groups.push(<Section key={`implicit-${groups.length}`}>{rows}</Section>);
    rows = [];
  };
  for (const child of flattenNativeChildren(children)) {
    if (
      isValidElement(child) &&
      (child.type === Section || child.type === NativeFieldGroup.Section)
    ) {
      flush();
      groups.push(
        child.type === Section ? (
          child
        ) : (
          <Section key={child.key} {...(child.props as FieldSectionProps)} />
        ),
      );
    } else rows.push(child);
  }
  flush();
  return groups;
}
