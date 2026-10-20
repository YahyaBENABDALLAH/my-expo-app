import { spacing, radii } from '@/constants/layout';
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
  borderRadius = radii.card,
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
    <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
      <HomeCatalogArtwork
        source={item.image}
        testID={`home-card-${item.id}-thumbnail`}
        width={thumbnailSize}
        height={thumbnailSize}
        borderRadius={radii.control}
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
          paddingVertical: spacing.sm,
          backgroundColor: colors.surfaceVariant,
          borderRadius: radii.sm,
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
        contentPadding={spacing.none}
        borderRadius={radii.card}
        onPress={onPress}
        testID={`home-card-${item.id}-open`}
      >
        <Column spacing={spacing.sm} style={{ width }}>
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
      spacing={hero ? spacing.none : spacing.lg}
      style={{
        width,
        ...(hero ? { backgroundColor: colors.warningContainer, borderRadius: radii.card } : {}),
      }}
    >
      <Column modifiers={nativeFillWidth}>
        <HomeCatalogArtwork
          source={item.image}
          testID={`home-card-${item.id}-artwork`}
          width={width}
          height={Math.round(width * 0.56)}
          borderRadius={radii.card}
        />
        {ribbon ? (
          <Column
            alignment="center"
            modifiers={nativeFillWidth}
            style={{ backgroundColor: colors.info, paddingVertical: spacing.sm }}
          >
            <Text fontSize={14} fontWeight="600" textStyle={{ color: colors.onInfo }}>
              {ribbon}
            </Text>
          </Column>
        ) : null}
      </Column>
      <Column
        spacing={spacing.lg}
        modifiers={nativeFillWidth}
        style={hero ? { padding: spacing.lg } : undefined}
      >
        {metadata}
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          {!hero ? (
            <Text variant="caption" textStyle={{ color: colors.muted }}>
              {item.category}
            </Text>
          ) : null}
          <Row spacing={spacing.sm} alignment="center" modifiers={nativeFillWidth}>
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
                <Row spacing={spacing.sm} alignment="center">
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
