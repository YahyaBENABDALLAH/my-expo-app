import { Column, Icon, Row } from '@expo/ui';
import type { ImageSource } from 'expo-image';
import { useThemeColors } from '@/hooks/use-theme';
import { HomeRecipeCardImage } from './home-recipe-card-image';
import { nativeFillWidth, nativeRowWeight } from './native-fill-width';
import { UniversalButtonContent } from './universal-button-content';
import { useHostColorScheme } from './universal-host';
import { UniversalTextContent as Text } from './universal-text';

const heart = Icon.select({
  ios: 'heart.fill',
  android: import('@expo/material-symbols/favorite.xml'),
});
const clock = Icon.select({ ios: 'clock', android: import('@expo/material-symbols/schedule.xml') });
const person = Icon.select({
  ios: 'person.crop.circle',
  android: import('@expo/material-symbols/person.xml'),
});
const star = Icon.select({ ios: 'star.fill', android: import('@expo/material-symbols/star.xml') });

export type HomeRecipeCardData = {
  image: ImageSource | number;
  title: string;
  description: string;
  duration: string;
  category: string;
  chef: string;
  likes: string;
  secondaryMeta: string;
};

export type HomeRecipeCardProps = {
  recipe: HomeRecipeCardData;
  variant: 'popular' | 'editorial';
  width: number;
  onPress: () => void;
  testID?: string;
};

/** Reference's two home card compositions, using static images and native controls. */
export function HomeRecipeCard({ recipe, variant, width, onPress, testID }: HomeRecipeCardProps) {
  const colors = useThemeColors(useHostColorScheme());
  const popular = variant === 'popular';
  const chef = (
    <Row
      alignment="center"
      spacing={6}
      style={{ backgroundColor: colors.surfaceRaised, borderRadius: 9999, padding: 8 }}
    >
      <Icon name={person} size={18} color={colors.tint} />
      <Text fontSize={13} fontWeight="600" numberOfLines={1}>
        {recipe.chef}
      </Text>
    </Row>
  );
  return (
    <UniversalButtonContent
      variant="link"
      borderRadius={0}
      contentPadding={0}
      onPress={onPress}
      testID={testID}
    >
      <Column
        spacing={popular ? 10 : 0}
        style={{
          width,
          ...(popular ? {} : { backgroundColor: colors.surfaceRaised, borderRadius: 14 }),
        }}
      >
        <HomeRecipeCardImage
          source={recipe.image}
          width={width}
          height={Math.round(width * (popular ? 0.82 : 0.62))}
          top={
            popular ? (
              <Row
                alignment="center"
                spacing={6}
                style={{ backgroundColor: colors.surfaceRaised, borderRadius: 9999, padding: 8 }}
              >
                <Icon name={heart} size={16} color={colors.error} />
                <Text fontSize={14} fontWeight="600">
                  {recipe.likes}
                </Text>
              </Row>
            ) : undefined
          }
          bottom={popular ? chef : undefined}
        />
        <Column
          spacing={popular ? 6 : 12}
          modifiers={nativeFillWidth}
          style={popular ? undefined : { padding: 18 }}
        >
          {!popular ? (
            <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
              <Column modifiers={nativeRowWeight}>
                <Column
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: 9999,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    fontSize={12}
                    fontWeight="600"
                    textStyle={{ color: colors.muted, letterSpacing: 1 }}
                  >
                    {recipe.category}
                  </Text>
                </Column>
              </Column>
              {chef}
            </Row>
          ) : null}
          <Text
            fontSize={popular ? 24 : 26}
            fontWeight="600"
            numberOfLines={popular ? 2 : undefined}
            textStyle={{ letterSpacing: -0.6 }}
          >
            {recipe.title}
          </Text>
          {!popular ? (
            <Text textStyle={{ color: colors.muted, lineHeight: 24 }}>{recipe.description}</Text>
          ) : null}
          <Row alignment="center" spacing={14} modifiers={nativeFillWidth}>
            <Row alignment="center" spacing={5}>
              <Icon name={clock} size={16} color={colors.tint} />
              <Text fontSize={14} fontWeight="600" textStyle={{ color: colors.tint }}>
                {recipe.duration}
              </Text>
            </Row>
            <Row alignment="center" spacing={5} modifiers={nativeRowWeight}>
              {!popular ? <Icon name={star} size={16} color={colors.tint} /> : null}
              <Text fontSize={14} numberOfLines={1} textStyle={{ color: colors.muted }}>
                {popular ? recipe.category : recipe.secondaryMeta}
              </Text>
            </Row>
          </Row>
        </Column>
      </Column>
    </UniversalButtonContent>
  );
}
