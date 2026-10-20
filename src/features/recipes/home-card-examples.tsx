import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  Column,
  HomeRecipeCard,
  Row,
  ScrollView,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  PageSection,
} from '@components/ui';
import { homeRecipeExamples } from './home-card-examples.data';
import { spacing } from '@/constants/layout';

/** Inline editorial cards share the page's vertical scroll; showcases can bound their viewport. */
export function HomeCardExamples({ editorialScroll = true }: { editorialScroll?: boolean }) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // The containing section owns the same gutters as the other recipe sections.
  const cardWidth = Math.min(560, Math.max(1, width - insets.left - insets.right - spacing.lg * 2));
  const popularWidth = Math.min(280, cardWidth);
  const examples = useMemo(() => homeRecipeExamples(t), [t]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = examples.find((recipe) => recipe.id === selectedId);
  const popularCards = useMemo(
    () =>
      examples.map((recipe) => (
        <HomeRecipeCard
          key={recipe.id}
          recipe={recipe}
          variant="popular"
          width={popularWidth}
          onPress={() => setSelectedId(recipe.id)}
          testID={`home-popular-example-${recipe.id}`}
        />
      )),
    [examples, popularWidth],
  );
  const editorialCards = useMemo(
    () =>
      examples.map((recipe) => (
        <HomeRecipeCard
          key={recipe.id}
          recipe={recipe}
          variant="editorial"
          width={cardWidth}
          onPress={() => setSelectedId(recipe.id)}
          testID={`home-editorial-example-${recipe.id}`}
        />
      )),
    [examples, cardWidth],
  );
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="home-card-examples">
      <Column spacing={spacing.xs}>
        <Text variant="title">{t('home.cards.title')}</Text>
        <Text variant="caption">{t('home.cards.sampleHint', { count: examples.length })}</Text>
      </Column>
      <Text fontWeight="600">{t('home.popular')}</Text>
      <ScrollView direction="horizontal" testID="home-popular-card-examples">
        <Row spacing={spacing.md}>{popularCards}</Row>
      </ScrollView>
      <Text fontWeight="600">{t('home.editorsChoice')}</Text>
      {editorialScroll ? (
        <ScrollView
          direction="vertical"
          style={{ height: 300 }}
          testID="home-editorial-card-examples"
        >
          <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
            {editorialCards}
          </Column>
        </ScrollView>
      ) : (
        <Column
          spacing={spacing.lg}
          modifiers={nativeFillWidth}
          testID="home-editorial-card-examples"
        >
          {editorialCards}
        </Column>
      )}
      {selected ? (
        <BottomSheet
          isPresented
          onDismiss={() => setSelectedId(null)}
          testID="home-example-recipe-sheet"
        >
          <ScrollView style={{ height: Math.min(520, Math.max(120, height * 0.65)) }}>
            <PageSection>
              <Text variant="caption">{t('home.cards.samplePreview')}</Text>
              <Text variant="title" testID="home-example-recipe-title">
                {selected.title}
              </Text>
              <Text>{selected.description}</Text>
              <Text variant="caption">{`${selected.duration} · ${selected.secondaryMeta} · ${selected.chef}`}</Text>
              <UniversalButtonContent
                variant="secondary"
                fullWidth
                label={t('common.close')}
                onPress={() => setSelectedId(null)}
                testID="home-example-recipe-close"
              />
            </PageSection>
          </ScrollView>
        </BottomSheet>
      ) : null}
    </Column>
  );
}
