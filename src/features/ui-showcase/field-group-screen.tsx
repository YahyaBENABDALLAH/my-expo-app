import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  FieldGroup,
  PageFrame,
  Switch,
  TextInput,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  pageFormModifiers,
} from '@components/ui';
import { screenInsets } from '@/lib/screen-insets';

export default function FieldGroupScreen() {
  const { t } = useTranslation();
  return (
    <PageFrame
      title={t('showcase.fieldGroup')}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/ui'))}
    >
      <FieldGroupContent />
    </PageFrame>
  );
}

// The form owns scrolling. Read the safe areas inside PageFrame, after its header inset.
function FieldGroupContent() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [vegetarian, setVegetarian] = useState(false);
  const [quickMeals, setQuickMeals] = useState(true);
  const [draft, setDraft] = useState('');
  return (
    <View style={{ flex: 1, ...screenInsets(insets) }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <UniversalHost matchContents={false} ignoreSafeArea="all" style={{ flex: 1 }}>
          <FieldGroup
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
            testID="demo-field-group"
          >
            <FieldGroup.Section>
              <Text>{t('showcase.gallery.fieldGroupDescription')}</Text>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('showcase.preferences')}>
              <Switch
                label={t('showcase.vegetarian')}
                value={vegetarian}
                onValueChange={setVegetarian}
                testID="demo-field-group-vegetarian"
              />
              <Switch
                label={t('showcase.quickMeals')}
                value={quickMeals}
                onValueChange={setQuickMeals}
                testID="demo-field-group-quick"
              />
              <FieldGroup.SectionFooter>
                <Text>{t('showcase.gallery.localOnly')}</Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section>
              <FieldGroup.SectionHeader>
                <Text variant="subtitle">{t('showcase.gallery.customHeader')}</Text>
              </FieldGroup.SectionHeader>
              <TextInput
                label={t('showcase.draft')}
                value={draft}
                onChangeText={setDraft}
                testID="demo-field-group-draft"
              />
              <FieldGroup.SectionFooter>
                <Text>{t('showcase.gallery.customFooter')}</Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('showcase.gallery.interaction')}>
              <Text testID="demo-field-group-value">
                {t('showcase.draftValue', { value: draft })}
              </Text>
              <UniversalButtonContent
                variant="secondary"
                label={t('showcase.gallery.reset')}
                onPress={() => {
                  setVegetarian(false);
                  setQuickMeals(true);
                  setDraft('');
                }}
                testID="demo-field-group-reset"
              />
            </FieldGroup.Section>
          </FieldGroup>
        </UniversalHost>
      </KeyboardAvoidingView>
    </View>
  );
}
