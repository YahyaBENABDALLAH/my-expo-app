---
name: foodiya-ui-text
description: Choose or maintain Foodiya raw native Text, UniversalTextContent and hosted UniversalText with semantic typography, tones, wrapping and explicit overrides. Use for text composition and its in-app showcase.
---

# Text

Import text components/types from `@components/ui`. Follow
[Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).
Read the [implementation and types](../../../src/components/ui/text/universal-text.tsx).

## Pick the actual rendering boundary

| Component              | Use                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `UniversalTextContent` | Themed text inside PageScreen, native groups and existing Hosts.                     |
| `UniversalText`        | Standalone text at an RN boundary; owns a UniversalHost.                             |
| `Text`                 | Raw Expo UI native export; useful when native foreground inheritance is intentional. |

Do not put hosted standalone text inside ordinary native layout. Use native
`Column`/`Row` for siblings. Text children are a string in the installed
contract, not an RN rich-text tree or an arbitrary React subtree.

## Typography and foreground

Supported `variant` values are `heading`, `title`, `subtitle`, `body`,
`label` and `caption`. Omit variant/font overrides to keep native typography.
Presets set size/weight only; no line height is calculated.

Brand typography is selected by the existing asset helper for auth and launch
headings. Preserve native typography elsewhere. Unsupported languages, including
Arabic for the bundled Inter font, use native fallback. Keep asset and family
registration with the [configuration owner](../foodiya-implementation/references/configuration.md).

`tone` selects foreground independently: `default`, `muted`, `primary`,
`secondary`, `success`, `warning`, `error` or `info`.
Default maps to `text`; primary maps to the foreground accent `tint`. Keep
`primary`/`onPrimary` for filled buttons: a fill can deliberately stay black in
dark mode and is not an ordinary text foreground. Other tones use their matching
semantic tokens. Content resolves its owning Host's
scheme unless explicitly overridden.

```tsx
<UniversalTextContent variant="body" tone="muted" modifiers={nativeFillWidth}>
  {t('showcase.gallery.longText')}
</UniversalTextContent>
```

Precedence is intentional:

- `fontSize`/`fontWeight` override the preset; final `textStyle` font fields
  override both.
- The active `lightColor` or `darkColor` overrides tone; final
  `textStyle.color` overrides both.
- Content `colorScheme` changes color resolution, not its owning native Host.
  Standalone text also passes its scheme to its Host.
- Raw `Text` can inherit a native button's contrasting foreground. The themed
  content wrapper supplies its own foreground and can override that contrast;
  do not use it blindly in filled-button labels.

## Layout and accessibility

Use native `style` for supported box properties and `textStyle` for typography.
Do not pass RN style arrays or invent font/line-clamp props. Native text
`numberOfLines` truncates; leave essential instructions/errors free to wrap.
Use logical layout and native text direction for Arabic. Do not force
left/right alignment globally or hardcode a height around large text.

Keep labels/messages translated and semantic colors in shared theme tokens.
A tone does not replace an understandable status message or establish heading/
screen-reader semantics. Check actual VoiceOver/TalkBack output when changing
accessibility behavior. Custom line height has platform differences; prefer
the existing native/preset behavior without a specific need.

## Showcase

[UI showcase → Text](../../../src/features/ui-showcase/text-screen.tsx), route
`/ui-component/text`, compares all six variants, all eight tones, wrapping,
two-line truncation, native/custom typography and standalone hosting.
Its isolated palette/appearance controls compare every tone on `background`,
`surface` and `surfaceRaised`, explicit appearance/style color precedence and a
counted primary button. The existing `demo-text-tone-*` selectors remain on the
background samples; other surfaces add their role to the selector. Override
samples use `demo-text-appearance-override` and `demo-text-style-override`.
The retained `Components/Text/ThemeComparison` story uses the same composition.
Only the color-sample area has an isolated provider. It re-enters native UI
through an explicit-scheme `UniversalHost` after `HostedPreview`'s RN bridge;
page chrome and the other text examples keep the app's configured appearance.
Follow the [appearance contract](../foodiya-ui-appearance/SKILL.md) for preview
isolation and saved app preferences. Static palette contrast checks do not verify
native glass, arbitrary overrides or text drawn over artwork.
Check light/dark, RTL, large text, truncation and contrast on native devices.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Text](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/text/).
