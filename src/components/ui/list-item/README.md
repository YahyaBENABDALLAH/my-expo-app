# List item

Exports: `ListItem` and `UniversalListItem` (the same component).

`list-item.tsx` owns the shared root Expo UI composition, Host theme lookup, and
Leading, Supporting and Trailing slots. `list-item-appearance.ios.tsx` and
`.android.tsx` adapt only native props: iOS slot text/background/separator colors,
Android row palettes and selectors. Caller modifiers and Android color overrides
keep their existing precedence; nested slots and numeric zero remain supported.
`list-item-appearance.d.ts` declares the private native helper's contract.
The public barrel exports the compatibility alias directly, without another file
or rendering wrapper.

Compose inside a native List/Host. Keep selection state in the caller.

Existing composition story: [list.stories.tsx](../../../../.rnstorybook/stories/expo-ui/list.stories.tsx).
CompoundSlots and CompoundSlotsLight exercise nested slot precedence, zero
supporting text, row activation and a row without an action. The list Maestro flow
includes the compound story; native execution remains pending. Control-theme
tests check live Host changes, caller overrides, slots and single action delivery;
Metro checks verify the shared component and platform appearance helpers.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
