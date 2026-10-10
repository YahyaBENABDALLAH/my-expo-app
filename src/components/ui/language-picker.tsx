import { useLanguage } from '@/context/language.context';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { Picker } from './picker';

// Autonyms keep every language identifiable, even before a user understands the UI.
const labels: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};

export function LanguagePicker({ testID = 'page-language-picker' }: { testID?: string }) {
  const { language, setLanguage, ready } = useLanguage();
  return (
    <Picker<Language>
      selectedValue={language}
      onValueChange={(value) => setLanguage?.(value)}
      enabled={ready && Boolean(setLanguage)}
      appearance="menu"
      testID={testID}
    >
      {SUPPORTED_LANGUAGES.map((value) => (
        <Picker.Item key={value} value={value} label={i18n.getFixedT(value)(labels[value])} />
      ))}
    </Picker>
  );
}
