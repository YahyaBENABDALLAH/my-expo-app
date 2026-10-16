# Brand themes

`index.ts` exports the five named themes and their stable IDs. The WhatsApp
palette keeps its existing brand and feedback choices in `whatsapp.ts`.

`brand-palettes.json` contains the explicit light/dark color values for Facebook,
Instagram and TikTok. Their existing modules export the resolved palettes through
`createBrandTheme` in `tokens.ts`. Its typed input requires every brand role in
both appearances; shared feedback defaults and derived UI roles are assembled
in one place. JSON is bundled as static configuration, with no runtime fetch.

`ux.ts` defines **UX Template** using the stable `ux` ID. Its primary fill is
`#000000` with `#FFFFFF` labels in both appearances. Foundations, navigation and
ordinary actions stay black, white and neutral gray. Feedback adds restrained
brick red danger, forest green success and amber warning, each with an explicit
container and readable foreground in both appearances. Info remains neutral.
`createColorTokens` derives roles from this explicit palette.
Dark appearance uses a white tint for readable links; the primary fill stays black.
Native button adapters apply the UX semantic pairs when both color
props are omitted, including standalone controls and their explicit scheme.
Storybook reuses the same semantic pairs. Explicit caller colors retain priority.
Aurora becomes flat and pauses its animation for this wireframe theme.
The existing ID preserves the selected theme across the update.

Keep brand-specific colors explicit. `createColorTokens` owns the derived
navigation, switch and control roles; changing those mappings changes all themes.
Do not introduce another palette or change a brand's colors while refactoring.

Native theme compositions live in
[theme.stories.tsx](../../../.rnstorybook/stories/expo-ui/theme.stories.tsx) and
[app-settings.stories.tsx](../../../.rnstorybook/stories/pages/app-settings.stories.tsx).
`tests/layout/page-appearance.test.mjs` checks brand/scheme selection, draft
retention and appearance propagation. Native colors, contrast and control feedback
require device verification.
