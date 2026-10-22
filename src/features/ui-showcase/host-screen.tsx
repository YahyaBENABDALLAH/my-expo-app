import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  PageScreen,
  ScrollView,
  Switch,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillSize,
  nativeFillWidth,
  useHostColorScheme,
  useHostLayoutDirection,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { DemoSection } from './demo-section';
import { HostedPreview } from './hosted-preview';

export default function HostScreen() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [presses, setPresses] = useState(0);
  return (
    <PageScreen
      title={t('showcase.gallery.host')}
      description={t('showcase.gallery.hostDescription')}
    >
      <DemoSection title={t('showcase.gallery.inherit')} hint={t('showcase.gallery.inheritHint')}>
        <HostedPreview>
          <UniversalHost testID="demo-host-inherited">
            <HostContent />
          </UniversalHost>
        </HostedPreview>
      </DemoSection>
      <DemoSection
        title={t('showcase.gallery.themeBoundary')}
        hint={t('showcase.gallery.boundedHint')}
      >
        <Switch
          label={t('common.darkMode')}
          value={dark}
          onValueChange={setDark}
          testID="demo-host-dark"
        />
        <Switch
          label={t('showcase.gallery.rtl')}
          value={rtl}
          onValueChange={setRtl}
          testID="demo-host-rtl"
        />
        <HostedPreview>
          <UniversalHost
            colorScheme={dark ? 'dark' : 'light'}
            layoutDirection={rtl ? 'rightToLeft' : 'leftToRight'}
            viewportHeight={220}
            testID="demo-host-bounded"
          >
            <ScrollView modifiers={nativeFillSize}>
              <HostContent />
            </ScrollView>
          </UniversalHost>
        </HostedPreview>
      </DemoSection>
      <DemoSection title={t('showcase.gallery.inline')} hint={t('showcase.gallery.inlineHint')}>
        <HostedPreview>
          <UniversalHost inline testID="demo-host-inline">
            <UniversalButtonContent
              variant="secondary"
              label={t('showcase.gallery.interaction')}
              onPress={() => setPresses((current) => current + 1)}
              testID="demo-host-inline-action"
            />
          </UniversalHost>
        </HostedPreview>
        <Text testID="demo-host-inline-value">{t('showcase.actions', { count: presses })}</Text>
      </DemoSection>
    </PageScreen>
  );
}

function HostContent() {
  const { t } = useTranslation();
  const scheme = useHostColorScheme();
  const direction = useHostLayoutDirection();
  const colors = useThemeColors(scheme);
  const [presses, setPresses] = useState(0);
  return (
    <Column
      spacing={spacing.md}
      modifiers={nativeFillWidth}
      style={{ padding: spacing.lg, backgroundColor: colors.surface }}
    >
      <Text variant="subtitle">
        {t(scheme === 'dark' ? 'common.darkMode' : 'common.lightMode')}
      </Text>
      <Text>
        {t(direction === 'rightToLeft' ? 'showcase.gallery.rtl' : 'showcase.gallery.ltr')}
      </Text>
      <UniversalButtonContent
        variant="primary"
        label={t('showcase.gallery.interaction')}
        onPress={() => setPresses((current) => current + 1)}
      />
      <Text>{t('showcase.actions', { count: presses })}</Text>
    </Column>
  );
}
