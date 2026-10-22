# Bottom-sheet composition

These examples use the existing public API. Keep labels translated in real
consumers and reuse the feature's own state/workflow. The
[skill](../SKILL.md) owns presentation, sizing and platform limitations.

## Short content inside a page

`PageScreen` supplies project hosting. `BottomSheet` creates its internal native
Host; the native content uses content controls without an extra Host. This
example keeps the presenter mounted, and its Close button and native dismissal
both clear the controlled state.

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BottomSheet,
  Column,
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';

export function RecipePreviewExample() {
  const { t } = useTranslation();
  const [isPresented, setIsPresented] = useState(false);
  const close = () => setIsPresented(false);

  return (
    <PageScreen title={t('showcase.bottomSheet')} description="">
      <PageSection>
        <UniversalButtonContent
          variant="primary"
          label={t('showcase.sheetGallery.openDetails')}
          fullWidth
          onPress={() => setIsPresented(true)}
        />
      </PageSection>
      <BottomSheet isPresented={isPresented} onDismiss={close}>
        <Column
          spacing={spacing.lg}
          modifiers={nativeFillWidth}
          style={{ paddingVertical: spacing.lg }}
        >
          <UniversalTextContent variant="title">{t('examples.salad')}</UniversalTextContent>
          <UniversalTextContent>{t('examples.saladDetail')}</UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            label={t('common.close')}
            fullWidth
            onPress={close}
          />
        </Column>
      </BottomSheet>
    </PageScreen>
  );
}
```

If the trigger is in an RN view rather than page-native content, use
`UniversalButton` there. Reuse an existing `UniversalHost` presentation boundary
for the sheet's project context; do not replace in-sheet content controls with
standalone buttons.

## Bounded scrolling

Within the same screen, calculate a responsive content height with
`useWindowDimensions` and pass it to both the sheet and its native scroll view.
Do not set this height on the inner content Column: the content needs to grow
beyond the viewport so every item and the last action can be reached.

```tsx
import { useWindowDimensions } from 'react-native';
import {
  BottomSheet,
  Column,
  ScrollView,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';

type GuideProps = {
  isPresented: boolean;
  onDismiss: () => void;
  title: string;
  closeLabel: string;
  items: { id: string; text: string }[];
};

export function GuideSheet({ isPresented, onDismiss, title, closeLabel, items }: GuideProps) {
  const { height } = useWindowDimensions();
  const contentHeight = Math.min(420, height * 0.6);

  return (
    <BottomSheet isPresented={isPresented} onDismiss={onDismiss} contentHeight={contentHeight}>
      <ScrollView style={{ height: contentHeight }} modifiers={nativeFillWidth}>
        <Column
          spacing={spacing.lg}
          modifiers={nativeFillWidth}
          style={{ paddingVertical: spacing.lg }}
        >
          <UniversalTextContent variant="title">{title}</UniversalTextContent>
          {items.map((item) => (
            <UniversalTextContent key={item.id}>{item.text}</UniversalTextContent>
          ))}
          <UniversalButtonContent
            variant="primary"
            label={closeLabel}
            fullWidth
            onPress={onDismiss}
          />
        </Column>
      </ScrollView>
    </BottomSheet>
  );
}
```

Use a bounded scroll area for forms that may outgrow a short window or enlarged
text. The scrolling action stays reachable at the end of the content; a fixed
footer would require allocating its height separately within the same bound.
Do not infer keyboard avoidance from a height cap: check focus and actual
visible controls on each platform when adding fields.

## Transactional preferences

Use the [showcase screen](../../../../src/features/ui-showcase/bottom-sheet-screen.tsx)
as the complete runnable example:

- Opening copies committed preferences into the draft before presentation.
- Switches update only the draft, using functional state updates.
- Apply commits that draft and closes the sheet.
- Cancel and native dismissal close without committing; the next opening resets
  the draft from committed values.
- Presenter components stay mounted, and each native dismissal clears only its
  matching active-sheet discriminator.

For a server-backed form, connect the existing workflow rather than copying this
demo's local commit into transport logic. Keep errors visible and retain the
draft on failure; only the workflow's actual success should trigger a commit or
success navigation.
