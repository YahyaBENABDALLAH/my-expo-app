import { spacing, radii } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, SkeletonContent, nativeFillWidth, useHostColorScheme } from '@components/ui';

/** Passive placeholders share the page Host; QueryContent supplies the loading announcement. */
export function HomeRecipeSkeletons() {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-loading-skeletons">
      {[0, 1].map((index) => (
        <Column
          key={index}
          spacing={spacing.sm}
          modifiers={nativeFillWidth}
          style={{ backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radii.card }}
          testID={`home-recipe-skeleton-${index}`}
        >
          <SkeletonContent style={{ height: 160 }} />
          <SkeletonContent style={{ height: 20 }} />
          <SkeletonContent style={{ width: 160, height: 12 }} />
          <SkeletonContent style={{ width: 96, height: 12 }} />
        </Column>
      ))}
    </Column>
  );
}
