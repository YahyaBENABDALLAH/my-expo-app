# Brand themes

`index.ts` exports UX Template (`ux`) and Instagram (`instagram`).
`brand-palettes.json` contains only Instagram light/dark colors, resolved through `createBrandTheme`.

`ux.ts` defines **UX Template** using the stable `ux` ID. Its primary fill is
`#000000` with `#FFFFFF` labels in both appearances. Foundations, navigation and
ordinary actions stay black, white and neutral gray. Feedback adds restrained
brick red danger, forest green success and amber warning, each with an explicit
container and readable foreground in both appearances. Info remains neutral.
`createColorTokens` derives roles from this explicit palette.
Dark appearance uses a white tint for readable links; the primary fill stays black.
Native button adapters apply semantic pairs for every theme when both color
props are omitted, including standalone controls and their explicit scheme.
Storybook reuses the same semantic pairs. Explicit caller colors retain priority.
The existing ID preserves the selected theme across the update.

Keep brand-specific colors explicit. `createColorTokens` owns the derived
navigation, switch and control roles; changing those mappings changes all themes.
Do not introduce another palette or change a brand's colors while refactoring.

Use the current [button stories](../../../../.rnstorybook/stories/components/button.stories.tsx)
and [theme controls](../../../../src/components/ui/appearance) for scheme selection.
Automated suites have been removed. Check theme selection, draft retention,
appearance propagation, contrast and native feedback on devices.
