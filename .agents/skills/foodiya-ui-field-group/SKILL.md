---
name: foodiya-ui-field-group
description: Compose or maintain Foodiya FieldGroup settings pages with native rows, trailing controls, bounded scrolling and section slots. Use for App Settings-style composition and its in-app showcase.
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

## Match the App Settings page

Use the [App Settings screen](../../../src/features/settings/settings-screen.tsx)
as the full-page reference. Reuse its
[SettingsRow](../../../src/features/settings/settings-row.tsx) for label/detail
columns, leading icons, trailing controls and native action rows. Keep a row
containing a trailing picker/switch passive; do not wrap that independent control
in another clickable row. A row with `onPress` already owns its native button.

Use `PageFrame scrollsBehindHeader`, a clipped bounded viewport with the page's
safe areas, and one fill Host. Put `usePageHeaderInset()` padding on a Column
inside the **first** section header so the initial content clears the header
and can scroll beneath its blur. Do not add the same padding to the viewport
or every section. Preserve keyboard avoidance when editable fields are present.

App Settings recreates only its iOS form Host on direction changes because
reused native cells can retain old direction. Keep controlled form state above
that Host so values survive this targeted remount. Ordinary edits and appearance
changes must not remount the form.

Production preference controls use their existing providers. A showcase uses
local values and an explicit Host/PageFrame scheme for appearance previews;
do not wire a demo picker to stored app preferences just to match the layout.
Shared row colors resolve their owning Host's scheme.

## Controls and verification

The owning Host supplies appearance/tint; native form sections own grouping,
row backgrounds and separators. Keep values local or in the existing form
workflow. FieldGroup itself supplies no schema, submit state or validation.
Use [FormTextInput](../foodiya-ui-form/SKILL.md) for React Hook Form binding.

[UI showcase → Field group](../../../src/features/ui-showcase/field-group-screen.tsx),
route `/ui-component/field-group`, uses the App Settings layout: account header,
appearance picker, notification rows, editable display name, About rows and reset.
Appearance and values stay local; a named row opens `/settings` for comparison.
Check scrolling beneath the header, the final action, keyboard reachability,
row/switch accessible names, wrapping, RTL and large text on iOS/Android.

API reference checked for SDK 57 / `@expo/ui` 57.0.21:
[FieldGroup](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/fieldgroup/).
