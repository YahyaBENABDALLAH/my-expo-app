import { RNHostView } from '@expo/ui';
import { Box } from '@expo/ui/jetpack-compose';
import { clip, paddingAll, Shapes, size, zIndex } from '@expo/ui/jetpack-compose/modifiers';
import { Image } from 'expo-image';
import type { HomeRecipeCardImageProps } from './home-recipe-card-image.types';

/** Keep badge overlays in the native tree above the passive hosted image. */
export function HomeRecipeCardImage({
  source,
  width,
  height,
  top,
  bottom,
}: HomeRecipeCardImageProps) {
  return (
    <Box modifiers={[size(width, height), clip(Shapes.RoundedCorner(14))]}>
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
        <Box contentAlignment="topEnd" modifiers={[size(width, height), paddingAll(12), zIndex(1)]}>
          {top}
        </Box>
      ) : null}
      {bottom ? (
        <Box
          contentAlignment="bottomEnd"
          modifiers={[size(width, height), paddingAll(12), zIndex(1)]}
        >
          {bottom}
        </Box>
      ) : null}
    </Box>
  );
}
