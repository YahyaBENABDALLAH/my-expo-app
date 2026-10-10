import { useThemeColors } from '@/hooks/use-theme';
import type { CollapsibleProps } from '@expo/ui';
import {
  AnimatedVisibility,
  Column,
  EnterTransition,
  ExitTransition,
  Icon,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  animated,
  background,
  clickable,
  clip,
  graphicsLayer,
  padding,
  Shapes,
  spring,
} from '@expo/ui/jetpack-compose/modifiers';
import { useHostColorScheme } from './universal-host';

const ENTER = EnterTransition.expandVertically().plus(EnterTransition.fadeIn());
const EXIT = ExitTransition.shrinkVertically().plus(ExitTransition.fadeOut());

export function Collapsible({
  isOpen,
  onOpenChange,
  label = '',
  labelStyle,
  children,
}: CollapsibleProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column
      modifiers={[
        clip(Shapes.RoundedCorner(16)),
        background(isOpen ? colors.surface : colors.controlSurface, { animationSpec: spring() }),
      ]}
    >
      <ListItem
        colors={{
          containerColor: 'transparent',
          contentColor: colors.text,
          trailingContentColor: colors.controlActive,
        }}
        modifiers={[clickable(() => onOpenChange(!isOpen))]}
      >
        <ListItem.HeadlineContent>
          <Text color={labelStyle?.color ?? colors.text} style={labelStyle}>
            {label}
          </Text>
        </ListItem.HeadlineContent>
        <ListItem.TrailingContent>
          <Icon
            source={require('@expo/material-symbols/keyboard_arrow_down.xml')}
            tint={colors.controlActive}
            modifiers={[graphicsLayer({ rotationZ: animated(isOpen ? 180 : 0, spring()) })]}
          />
        </ListItem.TrailingContent>
      </ListItem>
      <AnimatedVisibility visible={isOpen} enterTransition={ENTER} exitTransition={EXIT}>
        <Column modifiers={[padding(16, 16, 16, 16)]}>{children}</Column>
      </AnimatedVisibility>
    </Column>
  );
}
