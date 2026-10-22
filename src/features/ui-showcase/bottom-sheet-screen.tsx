import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BottomSheet,
  Column,
  PageScreen,
  PageSection,
  ScrollView,
  Switch,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';

type Sheet = 'details' | 'preferences' | 'scroll';

const cookingTips = [
  'examples.tip1',
  'examples.tip2',
  'examples.tip3',
  'examples.tip4',
  'examples.tip5',
  'examples.tip6',
] as const;

export default function BottomSheetScreen() {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const contentHeight = Math.min(420, height * 0.6);
  const [activeSheet, setActiveSheet] = useState<Sheet | null>(null);
  const [preferences, setPreferences] = useState({ vegetarian: false, quickMeals: true });
  const [draft, setDraft] = useState(preferences);

  // A late native callback from one sheet must not close a different example.
  function closeSheet(sheet: Sheet) {
    setActiveSheet((current) => (current === sheet ? null : current));
  }

  return (
    <PageScreen
      title={t('showcase.bottomSheet')}
      description={t('showcase.sheetGallery.description')}
    >
      <PageSection>
        <Text variant="title">{t('showcase.sheetGallery.details')}</Text>
        <Text>{t('showcase.sheetGallery.detailsHint')}</Text>
        <UniversalButtonContent
          variant="primary"
          label={t('showcase.sheetGallery.openDetails')}
          fullWidth
          testID="demo-sheet-open-details"
          onPress={() => setActiveSheet('details')}
        />
      </PageSection>

      <PageSection>
        <Text variant="title">{t('showcase.preferences')}</Text>
        <Text>{t('showcase.sheetGallery.preferencesHint')}</Text>
        <Text testID="demo-sheet-saved-vegetarian">
          {t('showcase.sheetGallery.savedValue', {
            label: t('showcase.vegetarian'),
            value: t(
              preferences.vegetarian ? 'showcase.sheetGallery.on' : 'showcase.sheetGallery.off',
            ),
          })}
        </Text>
        <Text testID="demo-sheet-saved-quick-meals">
          {t('showcase.sheetGallery.savedValue', {
            label: t('showcase.quickMeals'),
            value: t(
              preferences.quickMeals ? 'showcase.sheetGallery.on' : 'showcase.sheetGallery.off',
            ),
          })}
        </Text>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.sheetGallery.openPreferences')}
          fullWidth
          testID="demo-sheet-open-preferences"
          onPress={() => {
            setDraft(preferences);
            setActiveSheet('preferences');
          }}
        />
      </PageSection>

      <PageSection>
        <Text variant="title">{t('showcase.sheetGallery.scroll')}</Text>
        <Text>{t('showcase.sheetGallery.scrollHint')}</Text>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.sheetGallery.openScroll')}
          fullWidth
          testID="demo-sheet-open-scroll"
          onPress={() => setActiveSheet('scroll')}
        />
      </PageSection>

      <PageSection>
        <Text variant="title">{t('showcase.sheetGallery.tryDismissal')}</Text>
        <Text>{t('showcase.sheetGallery.dismissalHint')}</Text>
        <Text testID="demo-sheet-state">
          {t(activeSheet ? 'showcase.sheetGallery.presented' : 'showcase.sheetGallery.dismissed')}
        </Text>
      </PageSection>

      {/* Keep each presenter mounted while native dismissal finishes. */}
      <BottomSheet
        isPresented={activeSheet === 'details'}
        onDismiss={() => closeSheet('details')}
        testID="demo-sheet-details"
      >
        <Column
          spacing={spacing.lg}
          modifiers={nativeFillWidth}
          style={{ paddingVertical: spacing.lg }}
        >
          <Text variant="caption">{t('showcase.sheetGallery.details')}</Text>
          <Text variant="title">{t('examples.salad')}</Text>
          <Text>{t('examples.saladDetail')}</Text>
          <Text>{t('showcase.sheetGallery.detailsBody')}</Text>
          <UniversalButtonContent
            variant="primary"
            label={t('common.close')}
            fullWidth
            testID="demo-sheet-close-details"
            onPress={() => closeSheet('details')}
          />
        </Column>
      </BottomSheet>

      <BottomSheet
        isPresented={activeSheet === 'preferences'}
        onDismiss={() => closeSheet('preferences')}
        contentHeight={contentHeight}
        testID="demo-sheet-preferences"
      >
        <ScrollView
          style={{ height: contentHeight }}
          modifiers={nativeFillWidth}
          testID="demo-sheet-preferences-scroll"
        >
          <Column
            spacing={spacing.lg}
            modifiers={nativeFillWidth}
            style={{ paddingVertical: spacing.lg }}
          >
            <Text variant="title">{t('showcase.preferences')}</Text>
            <Text>{t('showcase.sheetGallery.draftHint')}</Text>
            <Switch
              label={t('showcase.vegetarian')}
              value={draft.vegetarian}
              onValueChange={(vegetarian) => setDraft((current) => ({ ...current, vegetarian }))}
              modifiers={nativeFillWidth}
              testID="demo-sheet-vegetarian"
            />
            <Switch
              label={t('showcase.quickMeals')}
              value={draft.quickMeals}
              onValueChange={(quickMeals) => setDraft((current) => ({ ...current, quickMeals }))}
              modifiers={nativeFillWidth}
              testID="demo-sheet-quick-meals"
            />
            <UniversalButtonContent
              variant="primary"
              label={t('showcase.sheetGallery.apply')}
              fullWidth
              testID="demo-sheet-apply"
              onPress={() => {
                setPreferences(draft);
                closeSheet('preferences');
              }}
            />
            <UniversalButtonContent
              variant="secondary"
              label={t('showcase.sheetGallery.cancel')}
              fullWidth
              testID="demo-sheet-cancel"
              onPress={() => closeSheet('preferences')}
            />
          </Column>
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        isPresented={activeSheet === 'scroll'}
        onDismiss={() => closeSheet('scroll')}
        contentHeight={contentHeight}
        testID="demo-sheet-scroll"
      >
        <ScrollView
          style={{ height: contentHeight }}
          modifiers={nativeFillWidth}
          testID="demo-sheet-tips-scroll"
        >
          <Column
            spacing={spacing.xl}
            modifiers={nativeFillWidth}
            style={{ paddingVertical: spacing.lg }}
          >
            <Text variant="title">{t('showcase.sheetGallery.scroll')}</Text>
            <Text>{t('showcase.sheetGallery.scrollBody')}</Text>
            {cookingTips.map((tip, index) => (
              <Column key={tip} spacing={spacing.sm} modifiers={nativeFillWidth}>
                <Text variant="subtitle">{t('showcase.tip', { index: index + 1 })}</Text>
                <Text>{t(tip)}</Text>
              </Column>
            ))}
            <Text tone="success" testID="demo-sheet-scroll-end">
              {t('showcase.sheetGallery.scrollEnd')}
            </Text>
            <UniversalButtonContent
              variant="primary"
              label={t('common.close')}
              fullWidth
              testID="demo-sheet-close-scroll"
              onPress={() => closeSheet('scroll')}
            />
          </Column>
        </ScrollView>
      </BottomSheet>
    </PageScreen>
  );
}
