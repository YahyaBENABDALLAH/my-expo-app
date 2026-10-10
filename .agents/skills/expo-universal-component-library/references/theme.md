# Theme tokens for native components

## Existing sources

- `src/constants/colors.ts`: shared light/dark app palette and `buttonSeedColors` semantic seeds.
- `src/components/ui/auth/auth-theme.ts`: auth light/dark palette and button container/content pairs.
- `src/components/ui/host/types.ts`: shared `colorScheme`, `seedColor`, and `testID` props.
- `src/components/ui/host/universal-host.tsx`: native Host wrapper, scheme selection, and sizing defaults.

These palettes currently differ. Reuse the palette appropriate to the component's existing scope. When asked to unify the theme, consolidate into one shared semantic source and migrate existing consumers deliberately; do not create a third parallel theme or change brand values as part of an unrelated component task.

## Token contract

Use semantic roles already present: `background`, `surface`, `text`, `muted`, `border`, `tint`, `error`, `success`, and `warning`. Keep explicit light/dark variants for intentional brand colors. Repeated layout/typography values may become shared tokens when actually needed; leave native typography, shape, elevation, and press feedback at their defaults unless behavior requires a change.

Host `colorScheme` selects appearance. Host `seedColor` derives Android Material colors and sets iOS native tint; it does not promise the exact same color for every native control. See [SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/). Use the installed API's real color hooks/props when mapping tokens; do not invent universal `containerColor` props or treat `UniversalStyle` as full RN styling.

Buttons customize shared colors and preserve native shape, padding, clickable bounds, disabled treatment and feedback. Do not paint a larger outer background around a smaller native clickable control. Legacy size/rounded props have been removed.

Every `UniversalButton` or `UniversalButtonContent` call requires `variant`: `primary` uses `tint`, `secondary` uses an outlined/bordered tint, `link` uses a text/plain tint, and `success`, `warning`, `destructive` use the corresponding semantic accent (`destructive` maps to `error`). Filled labels use the scheme's `background` token. Native disabled colors/opacity remain platform-owned. Auth Hosts supply their existing primary/secondary/link palette through `buttonPalette`, so all action buttons use the same universal implementation. Specialized icon and navigation buttons keep their explicitly selected native style.

`UniversalHost` provides its resolved scheme through React context. Hosted text, buttons and loading content use `useHostColorScheme` to inherit it; an explicit component scheme takes precedence. `UniversalButton` owns a Host at an RN boundary; `UniversalButtonContent` composes within an existing Host. Full-width buttons make the label/native surface fill together; inline buttons keep native intrinsic size.

## Documentation and story requirements

For a component, record which token roles it consumes, which native defaults it preserves, and any platform-specific mapping. Story canvases must consume the same tokens as production components rather than duplicate hex values.

Provide light/dark stories and semantic states relevant to the component. Make scheme/seed controls explicit so a story can be replayed independently of the device setting. Check readable labels, disabled state, focus/selection, and native press coverage on iOS and Android. Do not infer accessibility contrast from a token name or an Android seed; evaluate rendered foreground/background colors where accuracy matters.
