---
name: foodiya-ui-picker
description: Compose or maintain Foodiya Picker menus and iOS wheels with typed string/number items, controlled selection and disabled guards. Use for Picker.Item composition and the in-app showcase.
---

# Picker

Import `Picker` and its public types from `@components/ui`, inside the existing
Host. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Contract

Read the [public declaration](../../../src/components/ui/picker/picker.d.ts) and
both [iOS](../../../src/components/ui/picker/picker.ios.tsx) /
[Android](../../../src/components/ui/picker/picker.android.tsx) implementations.
Supported props are `selectedValue`, `onValueChange`, `children`,
`appearance`, `enabled` and `testID`.

Keep this family to the two native implementations and the public declaration.
The small item extraction stays inside each adapter; it does not need its own
helper or types file. Recheck both adapters when changing item handling.

The adapters supply behavior missing from the installed `@expo/ui` 57.0.21:
Android label synchronization, closing on disable and test selectors; iOS glass
menu styling and callback guards. Both retain fragment support and distinct
string/number keys. Recheck these differences before replacing them with a
direct package export.

```tsx
<Picker selectedValue={servings} onValueChange={setServings} testID="recipe-servings">
  <Picker.Item label={t('showcase.gallery.servings', { value: 1 })} value={1} />
  <Picker.Item label={t('showcase.gallery.servings', { value: 2 })} value={2} />
</Picker>
```

The consumer owns a string or number value. It must exactly match an item:
`2` and `'2'` differ. Keep values/React keys stable and translate only labels.
The callback receives the value directly, not an index, label or event.

## Items and native behavior

- Use `Picker.Item` markers directly or in supported fragments/arrays. They are
  data markers, not arbitrary rendered rows. Wrapping an Item in a custom
  component prevents the existing parser from recognizing it.
- Keep item values unique. When options change, reconcile invalid selection in
  the feature; do not leave a selected value absent from the options.
- Set `enabled={false}` to disable. Both adapters guard selection; Android
  closes an expanded dropdown when it becomes disabled. There is no `disabled`
  prop or per-item disabled contract.
- `appearance="menu"` is the default. `"wheel"` uses an iOS wheel; Android
  retains a dropdown. Do not promise identical geometry across platforms.
- There are no `style`, `modifiers`, `label`, `color` or `onChange` props
  in this project picker contract. Put a visible translated label beside it
  with native layout when needed.
- Native colors follow the Host. The iOS menu adapter requests native glass
  styling; retain the platform fallback and Android Material dropdown.
- Android uses the supplied selector on its anchor and derives
  `testID-option-index` for options. Do not use an option index as domain state.

## Showcase

[UI showcase → Picker](../../../src/features/ui-showcase/picker-screen.tsx),
route `/ui-component/picker`, covers string menus, numeric wheel/dropdown
selection, reset and disabled callback counts. Check updated labels after
selection/language changes, popup dismissal, RTL, large text and native focus.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Picker](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/picker/).
