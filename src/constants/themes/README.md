# Brand themes

`index.ts` exports the four named themes and their stable IDs. The WhatsApp
palette keeps its existing brand and feedback choices in `whatsapp.ts`.

`brand-palettes.json` contains the explicit light/dark color values for Facebook,
Instagram and TikTok. Their existing modules export the resolved palettes through
`createBrandTheme` in `tokens.ts`. Its typed input requires every brand role in
both appearances; shared feedback defaults and derived UI roles are assembled
in one place. JSON is bundled as static configuration, with no runtime fetch.

Keep brand-specific colors explicit. `createColorTokens` owns the derived
navigation, switch and control roles; changing those mappings changes all themes.
Do not introduce another palette or change a brand's colors while refactoring.

Native theme compositions live in
[theme.stories.tsx](../../../.rnstorybook/stories/expo-ui/theme.stories.tsx) and
[app-settings.stories.tsx](../../../.rnstorybook/stories/pages/app-settings.stories.tsx).
`tests/layout/page-appearance.test.mjs` checks brand/scheme selection, draft
retention and appearance propagation. Native colors, contrast and control feedback
require device verification.
