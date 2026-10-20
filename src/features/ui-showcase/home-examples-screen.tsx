import { spacing, radii } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Column,
  FieldGroup,
  List,
  ListItem,
  Row,
  ScrollView,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
  SkeletonContent,
  Switch,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { useEffect, useState } from 'react';
import { HomeCardExamples } from '@/features/recipes/home-card-examples';

export default function HomeExamplesScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen
      title={t('showcase.homeExamples')}
      description={t('showcase.homeExamplesDescription')}
    >
      <PageSection>
        <HomeSkeletonPreview />
        <HomeCardExamples />
        <HomeComponentExamples />
      </PageSection>
    </PageScreen>
  );
}
function HomeSkeletonPreview() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 10_000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="home-skeleton-preview">
      <Text variant="title" testID="home-skeleton-title">
        {t('showcase.skeleton')}
      </Text>
      <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
        <SkeletonContent
          testID="home-skeleton-avatar"
          style={{ width: 48, height: 48, borderRadius: radii.pill }}
        />
        <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
          <SkeletonContent testID="home-skeleton-heading" style={{ height: 20 }} />
          <SkeletonContent style={{ width: 120, height: 12, borderRadius: radii.pill }} />
        </Column>
      </Row>
      <Row
        spacing={spacing.sm}
        modifiers={nativeFillWidth}
        style={{ backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.sm }}
      >
        <SkeletonContent
          testID="home-skeleton-image"
          style={{ width: 96, height: 96, borderRadius: radii.card }}
        />
        <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
          <SkeletonContent style={{ width: 64, height: 12, borderRadius: radii.pill }} />
          <SkeletonContent style={{ height: 20 }} />
          <SkeletonContent style={{ width: 96, height: 20, borderRadius: radii.pill }} />
          <Row spacing={spacing.md}>
            <SkeletonContent style={{ width: 64, height: 12, borderRadius: radii.pill }} />
            <SkeletonContent style={{ width: 48, height: 12, borderRadius: radii.pill }} />
          </Row>
        </Column>
      </Row>
      <SkeletonContent testID="home-skeleton-full-width" style={{ height: 16 }} />
    </Column>
  );
}

const exampleMeals = [
  { id: 'toast', name: 'examples.toast', detail: 'examples.toastDetail' },
  { id: 'salad', name: 'examples.salad', detail: 'examples.saladDetail' },
  { id: 'pasta', name: 'examples.pasta', detail: 'examples.pastaDetail' },
];

const cookingTips = [
  'examples.tip1',
  'examples.tip2',
  'examples.tip3',
  'examples.tip4',
  'examples.tip5',
  'examples.tip6',
];

function HomeComponentExamples() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [vegetarian, setVegetarian] = useState(false);
  const [quickMeals, setQuickMeals] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState('common.none');

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="home-component-examples">
      <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.fieldGroup')}</Text>
        {/* Native forms and lists need a bounded height inside the page's scroll view. */}
        <FieldGroup style={{ height: 240 }} modifiers={nativeFillWidth} testID="home-field-group">
          <FieldGroup.Section title={t('showcase.preferences')}>
            <Switch
              label={t('showcase.vegetarian')}
              value={vegetarian}
              onValueChange={setVegetarian}
              modifiers={nativeFillWidth}
              testID="home-vegetarian-switch"
            />
            <Switch
              label={t('showcase.quickMeals')}
              value={quickMeals}
              onValueChange={setQuickMeals}
              modifiers={nativeFillWidth}
              testID="home-quick-meals-switch"
            />
            <FieldGroup.SectionFooter>
              <Text variant="caption">{t('showcase.trySwitches')}</Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
        </FieldGroup>
      </Column>
      <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.listTitle')}</Text>
        <Text variant="caption">{t('showcase.selectMeal')}</Text>
        <Column style={{ height: 240 }} modifiers={nativeFillWidth}>
          <List testID="home-example-list">
            {exampleMeals.map((meal) => (
              <ListItem
                key={meal.id}
                supportingText={t(meal.detail)}
                trailing={selectedMeal === meal.name ? t('common.selected') : undefined}
                onPress={() => setSelectedMeal(meal.name)}
                testID={`home-list-${meal.id}`}
              >
                {t(meal.name)}
              </ListItem>
            ))}
          </List>
        </Column>
        <Text testID="home-list-selection">
          {t('common.selectedValue', { value: t(selectedMeal) })}
        </Text>
      </Column>
      <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.horizontal')}</Text>
        <Text variant="caption">{t('showcase.swipeMeals')}</Text>
        <ScrollView
          direction="horizontal"
          style={{ height: 128 }}
          modifiers={nativeFillWidth}
          testID="home-horizontal-scroll"
        >
          <Row spacing={spacing.md}>
            {exampleMeals.map((meal) => (
              <Column
                key={meal.id}
                spacing={spacing.sm}
                style={{
                  width: 200,
                  padding: spacing.lg,
                  borderRadius: radii.card,
                  backgroundColor: colors.surface,
                }}
                testID={`home-horizontal-${meal.id}`}
              >
                <Text fontSize={20} fontWeight="600">
                  {t(meal.name)}
                </Text>
                <Text variant="caption">{t(meal.detail)}</Text>
              </Column>
            ))}
          </Row>
        </ScrollView>
      </Column>
      <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.vertical')}</Text>
        <Text variant="caption">{t('showcase.swipeTips')}</Text>
        <ScrollView
          direction="vertical"
          style={{ height: 224 }}
          modifiers={nativeFillWidth}
          testID="home-vertical-scroll"
        >
          <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
            {cookingTips.map((tip, index) => (
              <Column
                key={t(tip)}
                spacing={spacing.xs}
                modifiers={nativeFillWidth}
                style={{
                  padding: spacing.lg,
                  borderRadius: radii.card,
                  backgroundColor: colors.surface,
                }}
                testID={`home-vertical-tip-${index + 1}`}
              >
                <Text fontWeight="600">{t('showcase.tip', { index: index + 1 })}</Text>
                <Text>{t(tip)}</Text>
              </Column>
            ))}
          </Column>
        </ScrollView>
      </Column>
    </Column>
  );
}
