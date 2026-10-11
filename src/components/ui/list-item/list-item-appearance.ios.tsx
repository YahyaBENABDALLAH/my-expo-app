import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { HStack, Text } from '@expo/ui/swift-ui';
import {
  foregroundStyle,
  listRowBackground,
  listRowSeparatorTint,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { cloneElement, isValidElement, type ReactNode } from 'react';
import { flattenNativeChildren } from '../native/native-children';
import type { ListItemColors } from './list-item-appearance';

export function listItemAppearance(
  { supportingText, leading, trailing, children, modifiers, ...props }: ListItemProps,
  colors: ListItemColors,
): ListItemProps {
  const supporting = (node: ReactNode) =>
    typeof node === 'string' || typeof node === 'number' ? (
      <Text modifiers={[foregroundStyle(colors.muted)]}>{node}</Text>
    ) : (
      node
    );
  const accessory = (node: ReactNode, color: string) =>
    node == null ? (
      node
    ) : (
      <HStack spacing={0} modifiers={[foregroundStyle(color)]}>
        {typeof node === 'string' || typeof node === 'number' ? <Text>{node}</Text> : node}
      </HStack>
    );
  return {
    ...props,
    supportingText: supporting(supportingText),
    leading: accessory(leading, colors.controlActive),
    trailing: accessory(trailing, colors.muted),
    modifiers: [
      foregroundStyle(colors.text),
      tint(colors.controlActive),
      listRowBackground(colors.controlSurface),
      listRowSeparatorTint(colors.divider),
      ...(modifiers ?? []),
    ],
    children: flattenNativeChildren(children).map((child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return child;
      if (child.type === NativeListItem.Supporting)
        return cloneElement(child, { children: supporting(child.props.children) });
      if (child.type === NativeListItem.Leading)
        return cloneElement(child, {
          children: accessory(child.props.children, colors.controlActive),
        });
      if (child.type === NativeListItem.Trailing)
        return cloneElement(child, { children: accessory(child.props.children, colors.muted) });
      return child;
    }),
  };
}
