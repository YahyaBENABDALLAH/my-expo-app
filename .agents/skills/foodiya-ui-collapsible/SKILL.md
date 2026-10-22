---
name: foodiya-ui-collapsible
description: Compose or maintain Foodiya Collapsible disclosures, controlled expansion, retained drafts and one-open-section accordions. Use for the native disclosure contract and in-app showcase.
---

# Collapsible

Import `Collapsible` from `@components/ui` and reuse the existing Host.
Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Contract

The [local export](../../../src/components/ui/collapsible/collapsible.tsx) directly
re-exports Expo UI. Read its
[installed props](../../../node_modules/@expo/ui/src/universal/Collapsible/types.ts).

- Required: `isOpen: boolean`, `onOpenChange(next: boolean)`.
- Optional: translated `label`, native text `labelStyle`, native `children`.
- There is no `disabled`, `style`, `modifiers`, `testID`, custom trigger slot,
  `defaultOpen` or built-in accordion/group API. Give a surrounding native
  Column a selector when needed; do not pass unsupported props.

```tsx
<Collapsible label={t('common.details')} isOpen={open} onOpenChange={setOpen}>
  <Column spacing={spacing.md} modifiers={nativeFillWidth}>
    <UniversalTextContent>{t('showcase.expanded')}</UniversalTextContent>
    <TextInput label={t('showcase.draft')} value={draft} onChangeText={setDraft} />
  </Column>
</Collapsible>
```

The consumer owns `open` and `draft`. Put editable state above the disclosure
when it must survive collapse: native adapters may remove hidden content.
Do not use component keys, timers or layout measurement to retain a draft.

## Composition

Use one boolean per independent disclosure. For a one-open-section accordion,
use one stable identifier or `null`, derive each `isOpen`, and update that
identifier in `onOpenChange`. Opening/closing must not submit the contained form.
Keep the header's native disclosure action separate from child controls.

iOS uses DisclosureGroup; Android uses a Material expandable container with
native visibility animation. They need not have identical padding or chrome.
Use `labelStyle` only for intentional text changes; content text still needs
the project's themed text component. Do not add duplicate chevrons or JS motion.

## Showcase

[UI showcase → Collapsible](../../../src/features/ui-showcase/collapsible-screen.tsx),
route `/ui-component/collapsible`, covers retained draft state, an external
toggle, an accordion and collapse-all. Check keyboard/focus when collapsing an
edited field, native expansion, long labels, RTL and large text on both platforms.

API reference checked for SDK 57 / `@expo/ui` 57.0.21:
[Collapsible](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/collapsible/).
Verify installed APIs before changing native behavior.
