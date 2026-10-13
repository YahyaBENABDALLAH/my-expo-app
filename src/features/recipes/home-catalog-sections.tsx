import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  BottomSheet,
  Column,
  HomeCatalogCard,
  Row,
  ScrollView,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  type HomeCatalogItem,
} from '@components/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { homeCatalogItems } from './home-catalog.data';

const gutter = 16;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Column spacing={24} modifiers={nativeFillWidth}>
      <Column style={{ paddingHorizontal: gutter }}>
        <Text fontSize={24} fontWeight="700">
          {title}
        </Text>
      </Column>
      {children}
    </Column>
  );
}

function HorizontalRail({ children }: { children: ReactNode }) {
  return (
    <ScrollView direction="horizontal" showsIndicators={false} modifiers={nativeFillWidth}>
      <Row spacing={16} style={{ paddingHorizontal: gutter }}>
        {children}
      </Row>
    </ScrollView>
  );
}

/** One page scroll, horizontal rails, and short four-row columns like the reference. */
export function HomeCatalogSections({
  images,
}: {
  images?: readonly HomeCatalogItem['image'][];
} = {}) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(useHostColorScheme());
  const viewportWidth = width - insets.left - insets.right;
  const heroWidth = Math.min(520, Math.max(1, viewportWidth - 48));
  const landscapeWidth = Math.min(460, Math.max(1, viewportWidth * 0.78));
  const fullWidth = Math.max(1, viewportWidth - gutter * 2);
  // Keep photos stable across saves, previews, resizing and translation changes.
  const [imageSeed] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const items = homeCatalogItems(t, imageSeed, images);
  const [preview, setPreview] = useState<{ itemId: string | null; isPresented: boolean }>({
    itemId: null,
    isPresented: false,
  });
  const selected = items.find((item) => item.id === preview.itemId);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const actionLabel = t('common.details');
  const compactColumns = [items.slice(0, 4), items.slice(4, 8)];

  function openPreview(item: HomeCatalogItem) {
    setPreview({ itemId: item.id, isPresented: true });
  }

  function closePreview() {
    // Retain the body while Expo UI animates native dismissal.
    setPreview((current) => ({ ...current, isPresented: false }));
  }

  function compactRail(title: string, sectionId: string, reverse = false) {
    return (
      <Section title={title}>
        <HorizontalRail>
          {(reverse ? [...compactColumns].reverse() : compactColumns).map((column, index) => (
            <Column key={index} spacing={16} style={{ width: heroWidth }}>
              {column.map((item) => (
                <HomeCatalogCard
                  key={item.id}
                  item={{ ...item, id: `${sectionId}-${item.id}` }}
                  variant="compact"
                  width={heroWidth}
                  actionLabel={actionLabel}
                  onPress={() => openPreview(item)}
                />
              ))}
            </Column>
          ))}
        </HorizontalRail>
      </Section>
    );
  }

  return (
    <Column spacing={48} modifiers={nativeFillWidth} style={{ paddingTop: 12, paddingBottom: 32 }}>
      <Column spacing={24} modifiers={nativeFillWidth}>
        <Column modifiers={nativeFillWidth} style={{ paddingHorizontal: gutter }}>
          <UniversalButtonContent
            label={t('home.search')}
            variant="primary"
            testID="home-search"
            fullWidth
            onPress={() => router.navigate('/search')}
          />
        </Column>
        <HorizontalRail>
          {items.slice(0, 3).map((item) => {
            const saved = savedIds.includes(item.id);
            return (
              <HomeCatalogCard
                key={item.id}
                item={{ ...item, id: `hero-${item.id}` }}
                variant="hero"
                width={heroWidth}
                actionLabel={actionLabel}
                saved={saved}
                saveLabel={saved ? t('showcase.saved') : t('home.catalog.save')}
                onSave={() =>
                  setSavedIds((ids) =>
                    saved ? ids.filter((id) => id !== item.id) : [...ids, item.id],
                  )
                }
                onPress={() => openPreview(item)}
              />
            );
          })}
        </HorizontalRail>
      </Column>

      {compactRail(t('home.catalog.featured'), 'featured')}

      <Section title={t('home.catalog.fromOurKitchen')}>
        <HorizontalRail>
          {items.slice(0, 3).map((item) => (
            <HomeCatalogCard
              key={item.id}
              item={{ ...item, id: `kitchen-${item.id}` }}
              variant="landscape"
              width={landscapeWidth}
              actionLabel={actionLabel}
              onPress={() => openPreview(item)}
            />
          ))}
        </HorizontalRail>
      </Section>

      <Section title={t('home.catalog.experiences')}>
        <HorizontalRail>
          {items.slice(0, 3).map((item) => (
            <HomeCatalogCard
              key={item.id}
              item={{ ...item, id: `inspiration-${item.id}` }}
              variant="artwork"
              width={landscapeWidth}
              actionLabel={actionLabel}
              onPress={() => openPreview(item)}
            />
          ))}
        </HorizontalRail>
      </Section>

      <Column
        spacing={24}
        modifiers={nativeFillWidth}
        style={{
          backgroundColor: colors.infoContainer,
          paddingHorizontal: gutter,
          paddingVertical: 28,
        }}
      >
        <Column spacing={6}>
          <Text fontSize={24} fontWeight="700">
            {t('home.catalog.freeRecipes')}
          </Text>
          <Text textStyle={{ color: colors.muted }}>{t('home.catalog.weeklyPicks')}</Text>
        </Column>
        <HomeCatalogCard
          item={{ ...items[1], id: `free-${items[1].id}` }}
          variant="giveaway"
          width={fullWidth}
          actionLabel={actionLabel}
          ribbon={t('home.catalog.freeNow')}
          onPress={() => openPreview(items[1])}
        />
      </Column>

      {compactRail(t('home.catalog.quickMeals'), 'quick', true)}
      {compactRail(t('home.catalog.chefPicks'), 'chefs')}

      <Section title={t('home.discover')}>
        <Column spacing={16} modifiers={nativeFillWidth} style={{ paddingHorizontal: gutter }}>
          {items.map((item) => (
            <HomeCatalogCard
              key={item.id}
              item={{ ...item, id: `catalog-${item.id}` }}
              variant="compact"
              width={fullWidth}
              actionLabel={actionLabel}
              onPress={() => openPreview(item)}
            />
          ))}
        </Column>
      </Section>

      <BottomSheet
        isPresented={preview.isPresented}
        onDismiss={closePreview}
        initialContentWidth={Math.max(1, viewportWidth - 48)}
        testID="home-sample-preview"
      >
        {selected ? (
          <ScrollView style={{ height: Math.min(420, height * 0.6) }}>
            <Column spacing={16} modifiers={nativeFillWidth}>
              <Text variant="caption">{t('home.cards.samplePreview')}</Text>
              <Text variant="title" testID="home-sample-preview-title">
                {selected.title}
              </Text>
              <Text testID="home-sample-preview-description">{selected.description}</Text>
              <Text
                variant="caption"
                testID={`home-sample-preview-item-${selected.id}`}
              >{`${selected.duration} · ${selected.category} · ${selected.chef}`}</Text>
              <UniversalButtonContent
                variant="secondary"
                fullWidth
                label={t('common.close')}
                testID="home-sample-preview-close"
                onPress={closePreview}
              />
            </Column>
          </ScrollView>
        ) : null}
      </BottomSheet>
    </Column>
  );
}
