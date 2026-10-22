import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Column,
  FloatingAction,
  Icon,
  LoadingContent,
  PageScreen,
  PageSection,
  RNHostView,
  Row,
  Text,
  UniversalButton,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  type UniversalButtonContentProps,
  type UniversalButtonVariant,
} from '@components/ui';
import { radii, spacing } from '@/constants/layout';
import { useAppTheme, useThemeColors } from '@/hooks/use-theme';
import { useIsFocused } from 'expo-router';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'link',
  'success',
  'warning',
  'info',
  'destructive',
  'glass',
] as const satisfies readonly UniversalButtonVariant[];

const starIcon = Icon.select({
  ios: 'star.fill',
  android: import('@expo/material-symbols/star.xml'),
});
const checkIcon = Icon.select({
  ios: 'checkmark',
  android: import('@expo/material-symbols/check.xml'),
});

const iconPlacements = [
  { placement: 'leading', label: 'leadingIcon' },
  { placement: 'trailing', label: 'trailingIcon' },
  { placement: 'both', label: 'bothIcons' },
  { placement: 'above', label: 'aboveIcon' },
] as const;

type IconPlacement = (typeof iconPlacements)[number]['placement'];

function IconButtonExample({
  placement = 'leading',
  label,
  ...props
}: Omit<UniversalButtonContentProps, 'children' | 'label'> & {
  label: string;
  placement?: IconPlacement;
}) {
  return (
    <UniversalButtonContent {...props}>
      {placement === 'above' ? (
        <Column spacing={spacing.sm} alignment="center">
          <Icon name={starIcon} size={24} />
          <Text>{label}</Text>
        </Column>
      ) : (
        <Row spacing={spacing.sm} alignment="center">
          {placement !== 'trailing' && <Icon name={starIcon} size={18} />}
          <Text>{label}</Text>
          {placement !== 'leading' && <Icon name={checkIcon} size={18} />}
        </Row>
      )}
    </UniversalButtonContent>
  );
}

const geometryExamples = [
  { name: 'native', borderRadius: undefined },
  { name: 'square', borderRadius: radii.none },
  { name: 'rounded', borderRadius: radii.control },
  { name: 'pill', borderRadius: radii.pill },
] as const;

function GallerySection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <PageSection spacing={spacing.md}>
      <UniversalTextContent variant="subtitle">{title}</UniversalTextContent>
      {description && (
        <UniversalTextContent variant="caption" tone="muted">
          {description}
        </UniversalTextContent>
      )}
      {children}
    </PageSection>
  );
}

export default function ButtonsScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const [presses, setPresses] = useState(0);
  const [lastAction, setLastAction] = useState<string>();

  function recordPress(labelKey: string) {
    setPresses((count) => count + 1);
    setLastAction(labelKey);
  }

  return (
    <PageScreen title={t('showcase.buttons')} description={t('showcase.buttonDescription')}>
      <GallerySection title={t('showcase.floatingActions')}>
        <RNHostView matchContents>
          <View style={{ height: 84, alignItems: 'center', justifyContent: 'center' }}>
            <FloatingAction
              animate={focused}
              kind="create"
              label={t('showcase.floatingActions')}
              onPress={() => recordPress('showcase.floatingActions')}
            />
          </View>
        </RNHostView>
      </GallerySection>
      <GallerySection
        title={t('showcase.buttonGallery.interaction')}
        description={t('showcase.buttonGallery.interactionHint')}
      >
        <UniversalTextContent testID="demo-button-count">
          {t('showcase.actions', { count: presses })}
        </UniversalTextContent>
        <UniversalTextContent testID="demo-button-last-action" variant="caption" tone="muted">
          {lastAction
            ? t('showcase.buttonGallery.lastAction', { label: t(lastAction) })
            : t('showcase.buttonGallery.noActions')}
        </UniversalTextContent>
        <UniversalButtonContent
          variant="link"
          label={t('showcase.buttonGallery.reset')}
          testID="demo-button-reset"
          onPress={() => {
            setPresses(0);
            setLastAction(undefined);
          }}
        />
        <PendingButtonDemo onComplete={() => recordPress('showcase.buttonGallery.pendingAction')} />
      </GallerySection>

      <GallerySection
        title={t('showcase.buttonGallery.variants')}
        description={t('showcase.buttonGallery.variantsHint')}
      >
        {variants.map((variant) => (
          <Column key={variant} spacing={spacing.sm} modifiers={nativeFillWidth}>
            <UniversalTextContent variant="label">{t(`showcase.${variant}`)}</UniversalTextContent>
            <UniversalButtonContent
              variant={variant}
              label={t(`showcase.${variant}`)}
              fullWidth
              testID={`demo-button-${variant}`}
              onPress={() => recordPress(`showcase.${variant}`)}
            />
            <UniversalButtonContent
              variant={variant}
              label={t('showcase.disabledAction')}
              disabled
              fullWidth
              testID={`demo-button-${variant}-disabled`}
              onPress={() => recordPress(`showcase.${variant}`)}
            />
          </Column>
        ))}
        <UniversalTextContent variant="caption" tone="muted">
          {t('showcase.buttonGallery.glassHint')}
        </UniversalTextContent>
      </GallerySection>

      <IconVariantButtons onPress={recordPress} />

      <GallerySection title={t('showcase.buttonGallery.widths')}>
        <IconButtonExample
          variant="primary"
          label={t('showcase.buttonGallery.fitContent')}
          testID="demo-button-fit"
          onPress={() => recordPress('showcase.buttonGallery.fitContent')}
        />
        <IconButtonExample
          variant="primary"
          label={t('showcase.buttonGallery.fullWidth')}
          fullWidth
          testID="demo-button-full-width"
          onPress={() => recordPress('showcase.buttonGallery.fullWidth')}
        />
        <Row spacing={spacing.md} modifiers={nativeFillWidth}>
          <Column modifiers={nativeRowWeight}>
            <IconButtonExample
              variant="secondary"
              label={t('showcase.buttonGallery.cancel')}
              fullWidth
              testID="demo-button-row-cancel"
              onPress={() => recordPress('showcase.buttonGallery.cancel')}
            />
          </Column>
          <Column modifiers={nativeRowWeight}>
            <IconButtonExample
              variant="primary"
              label={t('showcase.buttonGallery.save')}
              fullWidth
              testID="demo-button-row-save"
              onPress={() => recordPress('showcase.buttonGallery.save')}
            />
          </Column>
        </Row>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.buttonGallery.longLabel')}
          fullWidth
          testID="demo-button-long-label"
          onPress={() => recordPress('showcase.buttonGallery.longLabel')}
        />
      </GallerySection>

      <GallerySection title={t('showcase.buttonGallery.content')}>
        <IconButtonExample
          variant="primary"
          label={t('showcase.buttonGallery.leadingIcon')}
          testID="demo-button-leading-icon"
          onPress={() => recordPress('showcase.buttonGallery.leadingIcon')}
        />
        <IconButtonExample
          variant="secondary"
          placement="trailing"
          label={t('showcase.buttonGallery.trailingIcon')}
          testID="demo-button-trailing-icon"
          onPress={() => recordPress('showcase.buttonGallery.trailingIcon')}
        />
        <IconButtonExample
          variant="secondary"
          label={t('showcase.disabledAction')}
          disabled
          testID="demo-button-icon-disabled"
          onPress={() => recordPress('showcase.disabledAction')}
        />
        <UniversalButtonContent
          variant="primary"
          fullWidth
          contentPadding={spacing.lg}
          testID="demo-button-stacked"
          onPress={() => recordPress('showcase.buttonGallery.stackedTitle')}
        >
          <Column spacing={spacing.xs} alignment="center">
            <Icon name={starIcon} size={24} />
            <Text>{t('showcase.buttonGallery.stackedTitle')}</Text>
            <Text>{t('showcase.buttonGallery.stackedDetail')}</Text>
          </Column>
        </UniversalButtonContent>
        <UniversalButtonContent
          variant="secondary"
          fullWidth
          contentPadding={0}
          borderRadius={radii.card}
          testID="demo-button-card"
          onPress={() => recordPress('showcase.buttonGallery.cardTitle')}
        >
          <Column spacing={spacing.sm} modifiers={nativeFillWidth} style={{ padding: spacing.xl }}>
            <Row spacing={spacing.sm} alignment="center">
              <Icon name={starIcon} size={18} />
              <Text>{t('showcase.buttonGallery.cardTitle')}</Text>
            </Row>
            <Text>{t('showcase.buttonGallery.cardDetail')}</Text>
          </Column>
        </UniversalButtonContent>
      </GallerySection>

      <GallerySection title={t('showcase.buttonGallery.geometry')}>
        {geometryExamples.map(({ name, borderRadius }) => (
          <IconButtonExample
            key={name}
            variant="primary"
            label={t(`showcase.buttonGallery.${name}`)}
            borderRadius={borderRadius}
            fullWidth
            testID={`demo-button-shape-${name}`}
            onPress={() => recordPress(`showcase.buttonGallery.${name}`)}
          />
        ))}
      </GallerySection>

      <GallerySection title={t('showcase.buttonGallery.padding')}>
        {[
          { name: 'noPadding', contentPadding: 0 },
          { name: 'regularPadding', contentPadding: spacing.md },
          { name: 'roomyPadding', contentPadding: spacing.xl },
        ].map(({ name, contentPadding }) => (
          <IconButtonExample
            key={name}
            variant="secondary"
            label={t(`showcase.buttonGallery.${name}`)}
            contentPadding={contentPadding}
            fullWidth
            testID={`demo-button-padding-${name}`}
            onPress={() => recordPress(`showcase.buttonGallery.${name}`)}
          />
        ))}
      </GallerySection>

      <SemanticColorButtons onPress={recordPress} />
      <StandaloneButton onPress={recordPress} />

      <PageSection>
        <UniversalTextContent testID="demo-button-count-footer">
          {t('showcase.actions', { count: presses })}
        </UniversalTextContent>
        <UniversalTextContent variant="caption" tone="muted">
          {lastAction
            ? t('showcase.buttonGallery.lastAction', { label: t(lastAction) })
            : t('showcase.buttonGallery.noActions')}
        </UniversalTextContent>
      </PageSection>
    </PageScreen>
  );
}

function PendingButtonDemo({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <IconButtonExample
        variant="primary"
        label={t(pending ? 'common.wait' : 'showcase.buttonGallery.pendingAction')}
        fullWidth
        disabled={pending}
        testID="demo-button-pending"
        onPress={() => {
          if (timer.current !== null) return;
          setPending(true);
          timer.current = setTimeout(() => {
            timer.current = null;
            setPending(false);
            onComplete();
          }, 1500);
        }}
      />
      {pending && <LoadingContent label={t('common.wait')} testID="demo-button-progress" />}
    </Column>
  );
}

function IconVariantButtons({ onPress }: { onPress: (labelKey: string) => void }) {
  const { t } = useTranslation();
  return (
    <GallerySection
      title={t('showcase.buttonGallery.iconVariants')}
      description={t('showcase.buttonGallery.iconVariantsHint')}
    >
      {variants.map((variant) => (
        <Column key={variant} spacing={spacing.md} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="label">{t(`showcase.${variant}`)}</UniversalTextContent>
          {iconPlacements.map(({ placement, label }) => (
            <IconButtonExample
              key={placement}
              variant={variant}
              placement={placement}
              label={t(`showcase.buttonGallery.${label}`)}
              fullWidth
              testID={`demo-button-icon-${variant}-${placement}`}
              onPress={() => onPress(`showcase.${variant}`)}
            />
          ))}
          <IconButtonExample
            variant={variant}
            label={t('showcase.disabledAction')}
            disabled
            fullWidth
            testID={`demo-button-icon-${variant}-disabled`}
            onPress={() => onPress(`showcase.${variant}`)}
          />
        </Column>
      ))}
    </GallerySection>
  );
}

function SemanticColorButtons({ onPress }: { onPress: (labelKey: string) => void }) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <GallerySection
      title={t('showcase.buttonGallery.colors')}
      description={t('showcase.buttonGallery.colorsHint')}
    >
      {(
        [
          { variant: 'primary', color: colors.primary, contentColor: colors.onPrimary },
          { variant: 'secondary', color: colors.secondary, contentColor: colors.secondary },
          { variant: 'success', color: colors.success, contentColor: colors.onSuccess },
          { variant: 'warning', color: colors.warning, contentColor: colors.onWarning },
          { variant: 'info', color: colors.info, contentColor: colors.onInfo },
          { variant: 'destructive', color: colors.error, contentColor: colors.onError },
        ] as const
      ).map(({ variant, color, contentColor }) => (
        <IconButtonExample
          key={variant}
          variant={variant}
          color={color}
          contentColor={contentColor}
          label={t(`showcase.${variant}`)}
          fullWidth
          testID={`demo-button-color-${variant}`}
          onPress={() => onPress(`showcase.${variant}`)}
        />
      ))}
    </GallerySection>
  );
}

function StandaloneButton({ onPress }: { onPress: (labelKey: string) => void }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme('light');
  return (
    <GallerySection
      title={t('showcase.buttonGallery.standalone')}
      description={t('showcase.buttonGallery.standaloneHint')}
    >
      <RNHostView matchContents>
        <View style={{ width: '100%', backgroundColor: colors.background, padding: spacing.lg }}>
          <UniversalButton
            variant="primary"
            colorScheme="light"
            color={colors.primary}
            contentColor={colors.onPrimary}
            contentPadding={spacing.lg}
            cornerRadii={{ topLeft: radii.card, bottomRight: radii.card }}
            fullWidth
            testID="demo-button-standalone-light"
            onPress={() => onPress('showcase.buttonGallery.lightCorners')}
          >
            <Row spacing={spacing.sm} alignment="center">
              <Icon name={starIcon} size={18} />
              <Text>{t('showcase.buttonGallery.lightCorners')}</Text>
            </Row>
          </UniversalButton>
        </View>
      </RNHostView>
    </GallerySection>
  );
}
