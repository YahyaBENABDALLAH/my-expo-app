# Button usage examples

Read only the example matching the rendering boundary. Labels in these examples
are already translated strings supplied by the feature; translate app-owned copy
with the existing `useTranslation().t()` setup and maintain French, English, and
Arabic dictionaries. The feature owns workflows, async errors, and navigation.

## Inside a page screen: full-width primary, secondary, disabled, and pending

`PageScreen` owns the Host. `PageSection` owns insets and fills the available
width. Do not wrap either content button in another Host.

```tsx
import { PageScreen, PageSection, UniversalButtonContent } from '@components/ui';

type Props = {
  title: string;
  description: string;
  submitLabel: string;
  waitingLabel: string;
  cancelLabel: string;
  canSubmit: boolean;
  pending: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export function ActionScreen(props: Props) {
  return (
    <PageScreen title={props.title} description={props.description}>
      <PageSection>
        <UniversalButtonContent
          variant="primary"
          label={props.pending ? props.waitingLabel : props.submitLabel}
          fullWidth
          disabled={!props.canSubmit || props.pending}
          onPress={props.onSubmit}
          testID="action-submit"
        />
        <UniversalButtonContent
          variant="secondary"
          label={props.cancelLabel}
          fullWidth
          disabled={props.pending}
          onPress={props.onCancel}
          testID="action-cancel"
        />
      </PageSection>
    </PageScreen>
  );
}
```

The feature must decide whether cancellation is allowed during a request; the
example disables it. Disabled is not a substitute for an immediate submission
guard in the workflow. On failure, restore interaction and retain draft/error
context through that workflow. `link` actions use the same callback prop; call
Expo Router in the feature callback rather than adding `href` to the button.

## One Host for a native action group

Create this owner at an RN boundary. When a Host already owns the group, return
the Column directly instead. `UniversalHost` supplies app scheme and direction;
`Column` supplies layout. Change `variant` to any of the nine supported intents
without changing the composition pattern.

```tsx
import { Column, UniversalButtonContent, UniversalHost, nativeFillWidth } from '@components/ui';
import { spacing } from '@/constants/layout';

export function NativeActionGroup(props: {
  primaryLabel: string;
  detailsLabel: string;
  onPrimary: () => void;
  onDetails: () => void;
  colorScheme?: 'light' | 'dark';
}) {
  return (
    <UniversalHost colorScheme={props.colorScheme}>
      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <UniversalButtonContent
          variant="primary"
          label={props.primaryLabel}
          fullWidth
          onPress={props.onPrimary}
        />
        <UniversalButtonContent
          variant="link"
          label={props.detailsLabel}
          onPress={props.onDetails}
        />
      </Column>
    </UniversalHost>
  );
}
```

## Standalone button in an existing React Native boundary

Use this pattern where RN infrastructure already owns the layout, such as an
overlay or footer. The button creates its Host. Keep screen-level safe-area and
keyboard handling in their existing owners. Omitting `fullWidth` retains
intrinsic sizing. Geometry overrides are optional, not new global defaults.

```tsx
import { View } from 'react-native';
import { UniversalButton } from '@components/ui';
import { radii, spacing } from '@/constants/layout';

export function FooterAction(props: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
  colorScheme?: 'light' | 'dark';
}) {
  return (
    <View style={{ width: '100%' }}>
      <UniversalButton
        variant="primary"
        label={props.label}
        disabled={props.disabled}
        colorScheme={props.colorScheme}
        borderRadius={radii.control}
        contentPadding={spacing.md}
        fullWidth
        onPress={props.onPress}
        testID="footer-action"
      />
    </View>
  );
}
```

When requested, a standalone button can instead receive
`cornerRadii={{ topLeft: radii.control, bottomRight: radii.control }}`. This clips
the existing Host around a square native button, overrides `borderRadius`, and
leaves the other two physical corners square. Check edge activation on devices.
Do not put that prop on `UniversalButtonContent`.

## Two equal-width actions inside an existing Host

`nativeRowWeight` is an exported modifier array, not a function. Each Column gets
one equal share; each button fills that share. For long translations or large
text, a vertical Column can be more appropriate than forcing a cramped row.

```tsx
import {
  Column,
  Row,
  UniversalButtonContent,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { spacing } from '@/constants/layout';

export function ActionRow(props: {
  cancelLabel: string;
  continueLabel: string;
  onCancel: () => void;
  onContinue: () => void;
  disabled?: boolean;
}) {
  return (
    <Row spacing={spacing.md} modifiers={nativeFillWidth}>
      <Column modifiers={nativeRowWeight}>
        <UniversalButtonContent
          variant="secondary"
          label={props.cancelLabel}
          onPress={props.onCancel}
          fullWidth
        />
      </Column>
      <Column modifiers={nativeRowWeight}>
        <UniversalButtonContent
          variant="primary"
          label={props.continueLabel}
          disabled={props.disabled}
          onPress={props.onContinue}
          fullWidth
        />
      </Column>
    </Row>
  );
}
```

## Auth form submit: reuse the existing adapter

`AuthScreenFrame` owns its Host. `FormSubmit` already renders a full-width primary
content button, disables it while `pending`, uses the translated waiting label,
and shows optional persistent error/notice text. It does not expose arbitrary
button variants or prerequisite-disable props. Use a content button when the
requested form needs a different contract; do not pass unsupported props to the
adapter. Connect `onPress` to the existing form's validated submit handler.

```tsx
import { AuthScreenFrame, FormSubmit } from '@components/ui';

export function AuthFormActions(props: {
  title: string;
  description: string;
  submitLabel: string;
  pending: boolean;
  error?: string;
  onValidatedSubmit: () => void;
}) {
  return (
    <AuthScreenFrame testID="auth-form" title={props.title} description={props.description}>
      <FormSubmit
        testID="auth-form-submit"
        label={props.submitLabel}
        pending={props.pending}
        error={props.error}
        onPress={props.onValidatedSubmit}
      />
    </AuthScreenFrame>
  );
}
```

## Icon and text inside an existing Host

Compose the entire native label as children. There is no `icon` prop; adding
children also means a separate `label` prop would be ignored. Use native `Text`
without a forced foreground to preserve the button's inherited content color.
Keep the text visible and verify screen-reader naming on both platforms.

```tsx
import { Icon, Row, Text, UniversalButtonContent } from '@components/ui';
import { spacing } from '@/constants/layout';

const favoriteIcon = Icon.select({
  ios: 'star.fill',
  android: import('@expo/material-symbols/star.xml'),
});

export function FavoriteAction(props: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <UniversalButtonContent
      variant="secondary"
      disabled={props.disabled}
      onPress={props.onPress}
      testID="favorite-action"
    >
      <Row spacing={spacing.sm} alignment="center">
        <Icon name={favoriteIcon} size={18} />
        <Text>{props.label}</Text>
      </Row>
    </UniversalButtonContent>
  );
}
```

For a whole-card action, follow the current
[RecipeCard](../../../../src/components/ui/recipe-card/recipe-card.tsx): a
full-width content button with deliberate padding/radius and native content;
necessary RN artwork is bridged by `RNHostView`. Reuse the card component instead
of duplicating its action tree. Do not nest interactive save/menu buttons inside
the outer action; use siblings as in the existing home catalog card.

## Action inside the shared bottom sheet

The current `BottomSheet` wraps Expo's native sheet, which creates its own native
Host. Its content can therefore use a content button and native Column directly.
Keep the existing sheet's presentation and app context; do not wrap each action
in a standalone button. Verify forced scheme and live RTL at this new native
root separately from the page behind it.

```tsx
import { BottomSheet, Column, UniversalButtonContent, nativeFillWidth } from '@components/ui';
import { spacing } from '@/constants/layout';

export function SheetAction(props: {
  open: boolean;
  label: string;
  disabled?: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet isPresented={props.open} onDismiss={props.onDismiss}>
      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <UniversalButtonContent
          variant="primary"
          label={props.label}
          disabled={props.disabled}
          onPress={props.onConfirm}
          fullWidth
          testID="sheet-confirm"
        />
      </Column>
    </BottomSheet>
  );
}
```
