import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  ColorSchemeControl,
  Column,
  PageScreen,
  PageSection,
  Row,
  Spacer,
  Text as NativeText,
  UniversalButtonContent,
  UniversalHost,
  UniversalText,
  UniversalTextContent as Text,
  nativeFillWidth,
  type UniversalTextTone,
  type UniversalTextVariant,
} from '@components/ui';
import { useAppTheme } from '@/hooks/use-theme';
import { ThemePreferencesProvider, useThemeSettings } from '@/context/theme.context';
import { spacing } from '@/constants/layout';
import { DemoSection } from './demo-section';
import { HostedPreview } from './hosted-preview';
import { ThemePicker } from './theme-picker';

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
  const preferences = useThemeSettings();
  const { colors } = useAppTheme();
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
      <DemoSection
        title={t('showcase.gallery.previewAppearance')}
        hint={t('showcase.gallery.previewAppearanceHint')}
      >
        <HostedPreview>
          <ThemePreferencesProvider
            initialTheme={preferences.themeId}
            initialColorScheme={preferences.colorScheme}
            initialHeaderShape={preferences.headerShape}
            initialReducedMotion={preferences.reducedMotion}
            allowThemeSelection
          >
            <TextColorPreview />
          </ThemePreferencesProvider>
        </HostedPreview>
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

/** Re-enter native UI after the RN bridge with the preview's explicit scheme. */
function TextColorPreview() {
  const { t } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const [presses, setPresses] = useState(0);
  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all" testID="demo-text-color-preview">
      <Column modifiers={nativeFillWidth} style={{ backgroundColor: colors.background }}>
        <PageSection>
          <Row alignment="center" modifiers={nativeFillWidth}>
            <Text>{t('common.theme')}</Text>
            <Spacer flexible />
            <ThemePicker />
          </Row>
          <Row alignment="center" modifiers={nativeFillWidth}>
            <Text>{t('common.colorScheme')}</Text>
            <Spacer flexible />
            <ColorSchemeControl testID="demo-text-color-scheme" />
          </Row>
        </PageSection>
        <DemoSection title={t('showcase.gallery.tones')} hint={t('showcase.gallery.tonesHint')}>
          {(['background', 'surface', 'surfaceRaised'] as const).map((surface) => (
            <Column
              key={surface}
              spacing={spacing.sm}
              modifiers={nativeFillWidth}
              style={{ backgroundColor: colors[surface], padding: spacing.md }}
              testID={`demo-text-surface-${surface}`}
            >
              <Text variant="caption" tone="muted">
                {surface}
              </Text>
              {tones.map((tone) => (
                <Text
                  key={tone}
                  tone={tone}
                  variant="body"
                  testID={
                    surface === 'background'
                      ? `demo-text-tone-${tone}`
                      : `demo-text-tone-${surface}-${tone}`
                  }
                >
                  {t(`showcase.gallery.tonesLabels.${tone}`)}
                </Text>
              ))}
            </Column>
          ))}
          <UniversalButtonContent
            variant="primary"
            label={t('showcase.gallery.primaryAction')}
            testID="demo-text-primary-button"
            onPress={() => setPresses((value) => value + 1)}
          />
          <Text testID="demo-text-press-count">{t('showcase.actions', { count: presses })}</Text>
        </DemoSection>
        <DemoSection title={t('showcase.gallery.textOverrides')}>
          <Text
            tone="primary"
            lightColor={colors.success}
            darkColor={colors.success}
            testID="demo-text-appearance-override"
          >
            {t('showcase.gallery.appearanceOverride')}
          </Text>
          <Text
            tone="primary"
            lightColor={colors.error}
            darkColor={colors.error}
            textStyle={{ color: colors.text }}
            testID="demo-text-style-override"
          >
            {t('showcase.gallery.styleOverride')}
          </Text>
        </DemoSection>
      </Column>
    </UniversalHost>
  );
}
