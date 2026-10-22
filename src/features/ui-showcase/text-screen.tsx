import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  Text as NativeText,
  UniversalText,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  type UniversalTextTone,
  type UniversalTextVariant,
} from '@components/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { DemoSection } from './demo-section';
import { HostedPreview } from './hosted-preview';

const variants = [
  'heading',
  'title',
  'subtitle',
  'body',
  'label',
  'caption',
] as const satisfies readonly UniversalTextVariant[];
const tones = [
  'default',
  'muted',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
] as const satisfies readonly UniversalTextTone[];

export default function TextScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <PageScreen
      title={t('showcase.gallery.text')}
      description={t('showcase.gallery.textDescription')}
    >
      <DemoSection title={t('showcase.gallery.typography')}>
        {variants.map((variant) => (
          <Text key={variant} variant={variant} testID={`demo-text-${variant}`}>
            {t(`showcase.gallery.variants.${variant}`)}
          </Text>
        ))}
      </DemoSection>
      <DemoSection title={t('showcase.gallery.tones')} hint={t('showcase.gallery.tonesHint')}>
        {tones.map((tone) => (
          <Text key={tone} tone={tone} variant="body" testID={`demo-text-tone-${tone}`}>
            {t(`showcase.gallery.tonesLabels.${tone}`)}
          </Text>
        ))}
      </DemoSection>
      <DemoSection title={t('showcase.gallery.wrap')}>
        <Text modifiers={nativeFillWidth} testID="demo-text-wrap">
          {t('showcase.gallery.longText')}
        </Text>
        <Text numberOfLines={2} modifiers={nativeFillWidth} testID="demo-text-truncate">
          {t('showcase.gallery.longText')}
        </Text>
        <Text variant="caption" tone="muted">
          {t('showcase.gallery.truncateHint')}
        </Text>
      </DemoSection>
      <DemoSection
        title={t('showcase.gallery.nativeText')}
        hint={t('showcase.gallery.nativeTextHint')}
      >
        <NativeText textStyle={{ color: colors.text }} testID="demo-text-native">
          {t('examples.salad')}
        </NativeText>
        <Text fontSize={22} fontWeight="700" testID="demo-text-custom">
          {t('showcase.gallery.customTypeSample')}
        </Text>
      </DemoSection>
      <DemoSection
        title={t('showcase.gallery.standalone')}
        hint={t('showcase.gallery.standaloneHint')}
      >
        <HostedPreview>
          <UniversalText variant="body" testID="demo-text-standalone">
            {t('examples.saladDetail')}
          </UniversalText>
        </HostedPreview>
      </DemoSection>
    </PageScreen>
  );
}
