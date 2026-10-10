import { useThemeColors } from '@/hooks/use-theme';
import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { HStack, Text } from '@expo/ui/swift-ui';
import {
  foregroundStyle,
  listRowBackground,
  listRowSeparatorTint,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { cloneElement, isValidElement, type ReactNode } from 'react';
import { useHostColorScheme } from './universal-host';
import { flattenNativeChildren } from './native-children';

export function ListItem({
  supportingText,
  leading,
  trailing,
  children,
  modifiers,
  ...props
}: ListItemProps) {
  const colors = useThemeColors(useHostColorScheme());
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
  return (
    <NativeListItem
      {...props}
      supportingText={supporting(supportingText)}
      leading={accessory(leading, colors.controlActive)}
      trailing={accessory(trailing, colors.muted)}
      modifiers={[
        foregroundStyle(colors.text),
        tint(colors.controlActive),
        listRowBackground(colors.controlSurface),
        listRowSeparatorTint(colors.divider),
        ...(modifiers ?? []),
      ]}
    >
      {flattenNativeChildren(children).map((child) => {
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
      })}
    </NativeListItem>
  );
}
ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;
