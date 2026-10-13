import { Column, Icon, RNHostView, Row } from '@expo/ui';
import { Image, type ImageSource } from 'expo-image';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalButtonContent } from '../button/universal-button-content';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';

const bookmark = Icon.select({
  ios: 'bookmark',
  android: import('@expo/material-symbols/bookmark.xml'),
});
const bookmarkFilled = Icon.select({
  ios: 'bookmark.fill',
  android: import('@expo/material-symbols/bookmark_added.xml'),
});

export type HomeCatalogItem = {
  id: string;
  image: ImageSource | number;
  title: string;
  duration: string;
  category: string;
  description: string;
  chef: string;
};

export type HomeCatalogCardProps = {
  item: HomeCatalogItem;
  variant: 'hero' | 'landscape' | 'artwork' | 'compact' | 'giveaway';
  width: number;
  actionLabel: string;
  onPress: () => void;
  saved?: boolean;
  saveLabel?: string;
  onSave?: () => void;
  ribbon?: string;
};

/** Passive image content keeps native card actions and scrolling in control. */
function HomeCatalogArtwork({
  source,
  width,
  height,
  borderRadius = 14,
  testID,
}: {
  source: ImageSource | number;
  width: number;
  height: number;
  borderRadius?: number;
  testID: string;
}) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column style={{ width, height, borderRadius, backgroundColor: colors.surfaceVariant }}>
      <RNHostView matchContents>
        <Image
          source={source}
          style={{ width, height, borderRadius }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={0}
          accessible={false}
          pointerEvents="none"
          testID={testID}
        />
      </RNHostView>
    </Column>
  );
}

/** Store-style artwork and metadata; all actions use the existing project Button. */
export function HomeCatalogCard({
  item,
  variant,
  width,
  actionLabel,
  onPress,
  saved = false,
  saveLabel,
  onSave,
  ribbon,
}: HomeCatalogCardProps) {
  const colors = useThemeColors(useHostColorScheme());
  const hero = variant === 'hero';
  const compact = variant === 'compact';
  const thumbnailSize = compact ? 64 : 48;
  const metadata = (
    <Row spacing={compact ? 10 : 12} alignment="center" modifiers={nativeFillWidth}>
      <HomeCatalogArtwork
        source={item.image}
        testID={`home-card-${item.id}-thumbnail`}
        width={thumbnailSize}
        height={thumbnailSize}
        borderRadius={compact ? 12 : 10}
      />
      <Column modifiers={nativeRowWeight}>
        <Text fontSize={compact ? 15 : 17} fontWeight="500" numberOfLines={2}>
          {item.title}
        </Text>
      </Column>
      <Column
        alignment="center"
        style={{
          width: 44,
          paddingVertical: 6,
          backgroundColor: colors.surfaceVariant,
          borderRadius: 4,
        }}
      >
        <Text fontSize={11} fontWeight="700" numberOfLines={1}>
          {item.duration}
        </Text>
      </Column>
      {compact ? (
        <UniversalButtonContent
          label={actionLabel}
          variant="secondary"
          onPress={onPress}
          testID={`home-card-${item.id}-open`}
        />
      ) : null}
    </Row>
  );

  if (compact) return <Column style={{ width }}>{metadata}</Column>;

  if (variant === 'artwork') {
    return (
      <UniversalButtonContent
        variant="link"
        contentPadding={0}
        borderRadius={14}
        onPress={onPress}
        testID={`home-card-${item.id}-open`}
      >
        <Column spacing={8} style={{ width }}>
          <HomeCatalogArtwork
            source={item.image}
            testID={`home-card-${item.id}-artwork`}
            width={width}
            height={Math.round(width * 0.56)}
          />
          <Text variant="caption" numberOfLines={1}>
            {item.title}
          </Text>
        </Column>
      </UniversalButtonContent>
    );
  }

  return (
    <Column
      spacing={hero ? 0 : 16}
      style={{
        width,
        ...(hero ? { backgroundColor: colors.warningContainer, borderRadius: 16 } : {}),
      }}
    >
      <Column modifiers={nativeFillWidth} style={{ borderRadius: hero ? 0 : 14 }}>
        <HomeCatalogArtwork
          source={item.image}
          testID={`home-card-${item.id}-artwork`}
          width={width}
          height={Math.round(width * 0.56)}
          borderRadius={0}
        />
        {ribbon ? (
          <Column
            alignment="center"
            modifiers={nativeFillWidth}
            style={{ backgroundColor: colors.info, paddingVertical: 8 }}
          >
            <Text fontSize={14} fontWeight="600" textStyle={{ color: colors.onInfo }}>
              {ribbon}
            </Text>
          </Column>
        ) : null}
      </Column>
      <Column
        spacing={hero ? 28 : 12}
        modifiers={nativeFillWidth}
        style={hero ? { padding: 16 } : undefined}
      >
        {metadata}
        <Column spacing={6} modifiers={nativeFillWidth}>
          {!hero ? (
            <Text variant="caption" textStyle={{ color: colors.muted }}>
              {item.category}
            </Text>
          ) : null}
          <Row spacing={8} alignment="center" modifiers={nativeFillWidth}>
            <Column modifiers={nativeRowWeight}>
              <UniversalButtonContent
                label={actionLabel}
                variant="secondary"
                fullWidth
                onPress={onPress}
                testID={`home-card-${item.id}-open`}
              />
            </Column>
            {hero && onSave ? (
              <UniversalButtonContent
                variant="secondary"
                onPress={onSave}
                testID={`home-card-${item.id}-save`}
              >
                <Row spacing={6} alignment="center">
                  <Icon name={saved ? bookmarkFilled : bookmark} size={18} color={colors.tint} />
                  <Text fontSize={13}>{saveLabel}</Text>
                </Row>
              </UniversalButtonContent>
            ) : null}
          </Row>
        </Column>
      </Column>
    </Column>
  );
}
