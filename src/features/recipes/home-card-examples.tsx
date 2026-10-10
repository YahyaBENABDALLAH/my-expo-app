import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
} from '@components/ui';
import { homeRecipeExamples } from './home-card-examples.data';

export function HomeCardExamples() {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Card buttons have no extra padding; PageScreen owns 24-point side insets.
  const cardWidth = Math.min(560, Math.max(1, width - insets.left - insets.right - 48));
  const popularWidth = Math.min(280, cardWidth);
  const examples = homeRecipeExamples(t);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = examples.find((recipe) => recipe.id === selectedId);
  return (
    <Column spacing={16} modifiers={nativeFillWidth} testID="home-card-examples">
      <Column spacing={4}>
        <Text variant="title">{t('home.cards.title')}</Text>
        <Text variant="caption">{t('home.cards.sampleHint', { count: examples.length })}</Text>
      </Column>
      <Text fontWeight="600">{t('home.popular')}</Text>
      <ScrollView direction="horizontal" testID="home-popular-card-examples">
        <Row spacing={12}>
          {examples.map((recipe) => (
            <HomeRecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="popular"
              width={popularWidth}
              onPress={() => setSelectedId(recipe.id)}
              testID={`home-popular-example-${recipe.id}`}
            />
          ))}
        </Row>
      </ScrollView>
      <Text fontWeight="600">{t('home.editorsChoice')}</Text>
      <ScrollView
        direction="vertical"
        style={{ height: 300 }}
        testID="home-editorial-card-examples"
      >
        <Column spacing={16} modifiers={nativeFillWidth}>
          {examples.map((recipe) => (
            <HomeRecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="editorial"
              width={cardWidth}
              onPress={() => setSelectedId(recipe.id)}
              testID={`home-editorial-example-${recipe.id}`}
            />
          ))}
        </Column>
      </ScrollView>
      {selected ? (
        <BottomSheet
          isPresented
          onDismiss={() => setSelectedId(null)}
          testID="home-example-recipe-sheet"
        >
          <ScrollView style={{ height: Math.min(520, Math.max(120, height * 0.65)) }}>
            <Column spacing={14} modifiers={nativeFillWidth} style={{ padding: 20 }}>
              <Text variant="caption">{t('home.cards.samplePreview')}</Text>
              <Text variant="title" testID="home-example-recipe-title">
                {selected.title}
              </Text>
              <Text>{selected.description}</Text>
              <Text variant="caption">{`${selected.duration} · ${selected.secondaryMeta} · ${selected.chef}`}</Text>
              <UniversalButtonContent
                variant="secondary"
                label={t('common.close')}
                onPress={() => setSelectedId(null)}
                testID="home-example-recipe-close"
              />
            </Column>
          </ScrollView>
        </BottomSheet>
      ) : null}
    </Column>
  );
}
