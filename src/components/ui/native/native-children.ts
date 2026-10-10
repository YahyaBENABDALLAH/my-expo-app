import { Children, cloneElement, Fragment, isValidElement, type ReactNode } from 'react';

/** Preserve compound slots and option order through conditional fragments. */
export function flattenNativeChildren(children: ReactNode, prefix = ''): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const key = `${prefix}${child.key}`;
    return child.type === Fragment
      ? flattenNativeChildren(child.props.children, `${key}/`)
      : [cloneElement(child, { key })];
  });
}
