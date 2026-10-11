import { useThemeColors } from '@/hooks/use-theme';
import { Column, SkeletonContent, nativeFillWidth, useHostColorScheme } from '@components/ui';

/** Passive placeholders share the page Host; QueryContent supplies the loading announcement. */
export function HomeRecipeSkeletons({ animate }: { animate: boolean }) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column spacing={12} modifiers={nativeFillWidth} testID="home-loading-skeletons">
      {[0, 1].map((index) => (
        <Column
          key={index}
          spacing={8}
          modifiers={nativeFillWidth}
          style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 16 }}
          testID={`home-recipe-skeleton-${index}`}
        >
          <SkeletonContent animate={animate} style={{ height: 160 }} />
          <SkeletonContent animate={animate} style={{ height: 20 }} />
          <SkeletonContent animate={animate} style={{ width: 160, height: 12 }} />
          <SkeletonContent animate={animate} style={{ width: 96, height: 12 }} />
        </Column>
      ))}
    </Column>
  );
}
