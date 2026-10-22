import { useState } from 'react';
import { useIsFocused } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Column,
  PageScreen,
  Row,
  Skeleton,
  SkeletonContent,
  Switch,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { radii, spacing } from '@/constants/layout';
import { DemoSection } from './demo-section';
import { HostedPreview } from './hosted-preview';

export default function SkeletonScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const [loaded, setLoaded] = useState(false);
  const [animate, setAnimate] = useState(true);
  return (
    <PageScreen
      title={t('showcase.skeleton')}
      description={t('showcase.gallery.skeletonDescription')}
    >
      <DemoSection title={t('showcase.gallery.shapes')} hint={t('showcase.gallery.shapesHint')}>
        <SkeletonContent testID="demo-skeleton-line" />
        <SkeletonContent
          style={{ width: 48, height: 48, borderRadius: radii.pill }}
          testID="demo-skeleton-avatar"
        />
        <SkeletonContent
          style={{ height: 96, borderRadius: radii.card }}
          testID="demo-skeleton-image"
        />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.card')}>
        <Switch
          label={t('showcase.gallery.showContent')}
          value={loaded}
          onValueChange={setLoaded}
          testID="demo-skeleton-content-toggle"
        />
        <Column spacing={spacing.md} modifiers={nativeFillWidth} testID="demo-skeleton-card">
          {loaded ? (
            <Column spacing={spacing.md} modifiers={nativeFillWidth}>
              <Text variant="title">{t('examples.salad')}</Text>
              <Text>{t('examples.saladDetail')}</Text>
              <Text tone="success">{t('showcase.gallery.loaded')}</Text>
            </Column>
          ) : (
            <>
              <Row spacing={spacing.md} modifiers={nativeFillWidth}>
                <SkeletonContent style={{ width: 48, height: 48, borderRadius: radii.pill }} />
                <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
                  <SkeletonContent style={{ height: 20 }} />
                  <SkeletonContent style={{ width: 120, height: 12 }} />
                </Column>
              </Row>
              <SkeletonContent style={{ height: 120, borderRadius: radii.card }} />
              <SkeletonContent />
            </>
          )}
        </Column>
      </DemoSection>
      <DemoSection title={t('showcase.gallery.pulse')} hint={t('showcase.gallery.pulseHint')}>
        <Switch
          label={t('showcase.gallery.animate')}
          value={animate}
          onValueChange={setAnimate}
          testID="demo-skeleton-animation-toggle"
        />
        <HostedPreview>
          <Skeleton
            animate={animate && focused}
            style={{ height: 20 }}
            testID="demo-skeleton-animated"
          />
          <Skeleton animate={false} style={{ height: 20 }} testID="demo-skeleton-static" />
        </HostedPreview>
      </DemoSection>
    </PageScreen>
  );
}
