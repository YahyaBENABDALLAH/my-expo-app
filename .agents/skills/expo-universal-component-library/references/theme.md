# Theme tokens for native components

## Existing sources

- `src/constants/colors.ts`: shared light/dark app palette and `buttonSeedColors` semantic seeds.
- `src/components/ui/auth/auth-theme.ts`: access to the same shared theme tokens for auth controls.
- `src/components/ui/host/types.ts`: shared `colorScheme`, `seedColor`, and `testID` props.
- `src/components/ui/host/universal-host.tsx`: native Host wrapper, scheme selection, and sizing defaults.

Buttons use native colors and Host appearance by default. Callers can pass existing theme tokens as explicit color overrides; the button layer has no theme hook or token lookup.

## Token contract

Use semantic roles already present: `background`, `surface`, `text`, `muted`, `border`, `tint`, `error`, `success`, and `warning`. Keep explicit light/dark variants for intentional brand colors. Repeated layout/typography values may become shared tokens when actually needed; leave native typography, shape, elevation, and press feedback at their defaults unless behavior requires a change.

Host `colorScheme` selects appearance. Host `seedColor` derives Android Material colors and sets iOS native tint; it does not promise the exact same color for every native control. See [SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/). Use the installed API's real color hooks/props when mapping tokens; do not invent universal `containerColor` props or treat `UniversalStyle` as full RN styling.

Buttons preserve native colors, shape, padding, clickable bounds, disabled treatment and feedback unless a caller supplies an override. Do not paint a larger outer background around a smaller native clickable control. Legacy size/rounded props have been removed.

Every `UniversalButton` or `UniversalButtonContent` call requires `variant`: `primary` uses the native filled style, `secondary` uses outlined/bordered, and `link` uses text/plain. `success`, `warning`, and `destructive` use the filled style with semantic colors supplied explicitly by callers; iOS destructive buttons also have the native destructive role. Optional `color` and `contentColor` pass directly to native controls. Omitted colors, padding and radius retain native defaults. There is no button theme hook, palette context, token lookup, generated color, measurement or sizing calculation. Native disabled colors/opacity and press feedback remain platform-owned. Specialized icon and navigation buttons keep their explicitly selected native style.

`UniversalHost` provides its resolved scheme through React context for styled text and loading content that use `useHostColorScheme`. Buttons inherit appearance directly from the native Host. `UniversalButton` owns a plain Expo UI Host at an RN boundary with an optional light/dark override; `UniversalButtonContent` composes within an existing Host and has no scheme prop. Full-width buttons make the label/native surface fill together; inline buttons keep native intrinsic size.

## Documentation and story requirements

For a component, record which token roles it consumes, which native defaults it preserves, and any platform-specific mapping. Story canvases must consume the same tokens as production components rather than duplicate hex values.

Provide light/dark stories and semantic states relevant to the component. Make scheme/seed controls explicit so a story can be replayed independently of the device setting. Check readable labels, disabled state, focus/selection, and native press coverage on iOS and Android. Do not infer accessibility contrast from a token name or an Android seed; evaluate rendered foreground/background colors where accuracy matters.
