import { RNHostView } from '@expo/ui';
import { VStack, ZStack } from '@expo/ui/swift-ui';
import { clipShape, frame, padding } from '@expo/ui/swift-ui/modifiers';
import { Image } from 'expo-image';
import type { HomeRecipeCardImageProps } from './home-recipe-card-image.types';
import { radii, spacing } from '@/constants/layout';

export function HomeRecipeCardImage({
  source,
  width,
  height,
  top,
  bottom,
}: HomeRecipeCardImageProps) {
  return (
    <ZStack modifiers={[frame({ width, height }), clipShape('roundedRectangle', radii.card)]}>
      <RNHostView matchContents>
        <Image
          source={source}
          style={{ width, height }}
          contentFit="cover"
          transition={0}
          accessible={false}
          pointerEvents="none"
          cachePolicy="memory-disk"
        />
      </RNHostView>
      {top ? (
        <VStack
          modifiers={[
            padding({ all: spacing.md }),
            frame({ width, height, alignment: 'topTrailing' }),
          ]}
        >
          {top}
        </VStack>
      ) : null}
      {bottom ? (
        <VStack
          modifiers={[
            padding({ all: spacing.md }),
            frame({ width, height, alignment: 'bottomTrailing' }),
          ]}
        >
          {bottom}
        </VStack>
      ) : null}
    </ZStack>
  );
}
