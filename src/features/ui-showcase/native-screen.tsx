import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  PageScreen,
  Row,
  ScrollView,
  Spacer,
  Switch,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeCenteredMinHeight,
  nativeFillSize,
  nativeFillWidth,
  nativeFillWidthCenter,
  nativeFillWidthEnd,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { spacing } from '@/constants/layout';
import { DemoSection } from './demo-section';

export default function NativeScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [presses, setPresses] = useState(0);
  const [overflow, setOverflow] = useState(false);
  return (
    <PageScreen
      title={t('showcase.gallery.native')}
      description={t('showcase.gallery.nativeDescription')}
    >
      <DemoSection title="nativeFillWidth" hint={t('showcase.gallery.widthHint')}>
        <UniversalButtonContent
          variant="primary"
          label={t('showcase.gallery.fullWidth')}
          fullWidth
          onPress={() => setPresses((current) => current + 1)}
          testID="demo-native-full-width"
        />
      </DemoSection>
      <DemoSection title="nativeRowWeight" hint={t('showcase.gallery.equalWidthHint')}>
        <Row spacing={spacing.md} modifiers={nativeFillWidth}>
          <Column modifiers={nativeRowWeight}>
            <UniversalButtonContent
              variant="secondary"
              label={t('common.recipes')}
              fullWidth
              onPress={() => setPresses((current) => current + 1)}
              testID="demo-native-first"
            />
          </Column>
          <Column modifiers={nativeRowWeight}>
            <UniversalButtonContent
              variant="secondary"
              label={t('common.favoritesOnly')}
              fullWidth
              onPress={() => setPresses((current) => current + 1)}
              testID="demo-native-second"
            />
          </Column>
        </Row>
        <Text testID="demo-native-actions">{t('showcase.actions', { count: presses })}</Text>
      </DemoSection>
      <DemoSection title={t('showcase.gallery.alignment')}>
        <Column
          alignment="start"
          modifiers={nativeFillWidth}
          style={{ padding: spacing.md, backgroundColor: colors.surface }}
        >
          <Text>{t('showcase.gallery.start')}</Text>
        </Column>
        <Column
          alignment="center"
          modifiers={nativeFillWidthCenter}
          style={{ padding: spacing.md, backgroundColor: colors.surface }}
        >
          <Text>{t('showcase.gallery.center')}</Text>
        </Column>
        <Column
          alignment="end"
          modifiers={nativeFillWidthEnd}
          style={{ padding: spacing.md, backgroundColor: colors.surface }}
        >
          <Text>{t('showcase.gallery.end')}</Text>
        </Column>
      </DemoSection>
      <DemoSection title="nativeFillSize" hint={t('showcase.gallery.fillHint')}>
        <Column style={{ height: 160 }} modifiers={nativeFillWidth}>
          <Column
            modifiers={nativeFillSize}
            alignment="center"
            style={{ backgroundColor: colors.surface }}
          >
            <Spacer />
            <Text>{t('showcase.gallery.bounded')}</Text>
            <Spacer />
          </Column>
        </Column>
      </DemoSection>
      <DemoSection title="nativeCenteredMinHeight" hint={t('showcase.gallery.minHint')}>
        <Switch
          label={t('showcase.gallery.showMore')}
          value={overflow}
          onValueChange={setOverflow}
          testID="demo-native-overflow-toggle"
        />
        <ScrollView
          style={{ height: 180 }}
          modifiers={nativeFillWidth}
          testID="demo-native-min-height-scroll"
        >
          <Column
            modifiers={nativeCenteredMinHeight(180)}
            alignment="center"
            style={{ padding: spacing.md, backgroundColor: colors.surface }}
          >
            <Text>
              {overflow
                ? `${t('showcase.gallery.longText')}\n\n${t('showcase.gallery.longText')}`
                : t('showcase.gallery.center')}
            </Text>
          </Column>
        </ScrollView>
      </DemoSection>
    </PageScreen>
  );
}
