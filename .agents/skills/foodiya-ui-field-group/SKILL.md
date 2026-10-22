---
name: foodiya-ui-field-group
description: Compose or maintain Foodiya FieldGroup forms with bounded native scrolling, sections, custom header/footer slots and existing form controls. Use for grouped form composition and its in-app showcase.
---

# FieldGroup

Use `FieldGroup` from `@components/ui` for grouped settings/form rows.
Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Contract and slots

The [local export](../../../src/components/ui/field-group/field-group.tsx) directly
re-exports `FieldGroup` and `FieldGroupProps`. Read the
[installed contract](../../../node_modules/@expo/ui/src/universal/FieldGroup/types.ts).

| Element                    | Use                                                                     |
| -------------------------- | ----------------------------------------------------------------------- |
| `FieldGroup`               | Scrollable form; native base props such as style, modifiers and testID. |
| `FieldGroup.Section`       | Group native rows; optional title and titleUppercase.                   |
| `FieldGroup.SectionHeader` | Custom native header; replaces the Section title.                       |
| `FieldGroup.SectionFooter` | Custom native footer after the rows.                                    |

Place sections directly in the group and header/footer markers directly in their
section. Compose native content inside slots; do not hide slot markers behind
custom React wrapper components that the native grouping parser cannot inspect.
Use one header and footer per section. `titleUppercase` applies on Android;
SwiftUI decides its own header case.

## Own scrolling once

FieldGroup wraps SwiftUI Form on iOS and a Compose LazyColumn on Android.
Give its Host a bounded viewport. For a screen, use the existing `PageFrame`
or `AuthScreenFrame grouped` pattern; do not put a full-height form inside
`PageScreen`'s vertical scroll view. A deliberately bounded preview is a
different composition, not a reason to duplicate screen scrolling.

At an RN boundary with an already bounded parent:

```tsx
<UniversalHost matchContents={false} style={{ flex: 1 }}>
  <FieldGroup modifiers={pageFormModifiers} style={{ backgroundColor: 'transparent' }}>
    <FieldGroup.Section title={t('showcase.preferences')}>
      <Switch label={t('showcase.vegetarian')} value={vegetarian} onValueChange={setVegetarian} />
      <FieldGroup.SectionFooter>
        <UniversalTextContent>{t('showcase.trySwitches')}</UniversalTextContent>
      </FieldGroup.SectionFooter>
    </FieldGroup.Section>
  </FieldGroup>
</UniversalHost>
```

Use `pageFormModifiers` for the app's transparent form canvas; on iOS, clearing
the view background alone does not hide Form's system canvas. Reuse page/auth
safe-area and keyboard infrastructure. Do not duplicate header clearance or
section gutters, or add a Host around every row.

## Controls and verification

The owning Host supplies appearance/tint; native form sections own grouping,
row backgrounds and separators. Keep values local or in the existing form
workflow. FieldGroup itself supplies no schema, submit state or validation.
Use [FormTextInput](../foodiya-ui-form/SKILL.md) for React Hook Form binding.

[UI showcase → Field group](../../../src/features/ui-showcase/field-group-screen.tsx),
route `/ui-component/field-group`, demonstrates titles, custom slots, editable
state and reset. Check scrolling to the final action, keyboard reachability,
helper wrapping, RTL and large text on iOS/Android.

API reference checked for SDK 57 / `@expo/ui` 57.0.21:
[FieldGroup](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/fieldgroup/).
