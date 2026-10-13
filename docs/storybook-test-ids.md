# Expo UI Storybook selectors

Open the on-device Storybook tab and select a story under **Expo UI** before targeting its IDs. IDs stay the same across states of a component; only one story canvas is rendered at a time. Each story's `testID` control can override its prefix. When rendering multiple component instances elsewhere in the app, supply a unique `testID` to each instance.

| Story group            | Root test ID           |
| ---------------------- | ---------------------- |
| Universal Button       | `expo-ui-button`       |
| Universal Text         | `expo-ui-text`         |
| Universal Text Input   | `expo-ui-text-input`   |
| Universal Bottom Sheet | `expo-ui-bottom-sheet` |
| Universal Collapsible  | `expo-ui-collapsible`  |
| Universal Switch       | `expo-ui-switch`       |
| Universal Slider       | `expo-ui-slider`       |
| Universal Picker       | `expo-ui-picker`       |
| Universal Field Group  | `expo-ui-field-group`  |
| Universal Icon         | `expo-ui-icon`         |
| Universal Spacer       | `expo-ui-spacer`       |
| Universal Column       | `expo-ui-column`       |
| Universal Checkbox     | `expo-ui-checkbox`     |
| Universal Scroll View  | `expo-ui-scroll-view`  |
| Universal List         | `expo-ui-list`         |

The root ID is forwarded to the native component where its installed Expo UI implementation supports it. Standalone wrapper components also expose a React Native host selector with `-container`, and canvases use `-canvas`. Hidden components and closed sheets have no visible native target; use the canvas or relevant open control to reach their visible state.

## Interactive selectors

| Group             | Useful suffixes appended to the root ID                                               |
| ----------------- | ------------------------------------------------------------------------------------- |
| Text Input        | `-label`, `-helper`, `-focus`, `-blur`, `-clear`, `-select`, `-set-value`, `-reset`   |
| Bottom Sheet      | `-open`, `-close`, `-state`, `-content`, `-title`, `-description`                     |
| Switch / Slider   | `-value`, `-reset`                                                                    |
| Picker / Checkbox | `-value`                                                                              |
| Collapsible       | `-content`, `-text`                                                                   |
| Field Group       | `-preferences`, `-notifications`, `-terms`, `-audio`, `-volume`, `-volume-value`      |
| Column            | `-item-1`, `-item-2`, etc.                                                            |
| Spacer            | `-start`, `-end`                                                                      |
| Scroll View       | `-content`, `-item-1`, `-item-2`, etc.                                                |
| List              | `-status`, `-empty`, `-row-1`, `-row-1-label`, `-row-1-icon`, `-row-1-trailing`, etc. |

Selectors only exist in stories that render the relevant elements. For example, use **Imperative Actions** for input focus/blur/clear buttons and **Controlled Native State** for set/reset buttons.

The **Recipes/Compact recipe card** stories use `recipe-card-storybook-recipe`
for the native action and `recipe-card-press-count` for its visible activation
count. Each press logs the recipe UUID and increments the count without navigating.
Use `recipes-compact-recipe-card--light` with the existing story-opening helper;
`.maestro/storybook/recipe-card.yaml` asserts repeated activation and the canvas.

**Recipes/Home catalog** uses `home-card-<section>-sample-<1..8>-open` for
Details and `home-card-hero-sample-<1..3>-save` for hero saves. The preview exposes
`home-sample-preview-title`, `home-sample-preview-description`,
`home-sample-preview-item-sample-<1..8>` and `home-sample-preview-close`.
`.maestro/storybook/home-catalog.yaml` uses `recipes-home-catalog--dark` and checks
reopening, dismissal and recipe selection through both scroll directions.

## Installed SDK limitations

- Collapsible has no native `testID` prop. Its root ID is applied to its Host. Tap the native header within that host and assert `expo-ui-collapsible-content` after expanding.
- Picker forwards `testID` on iOS but drops it on Android in the installed version. Use `expo-ui-picker-container` to locate the Android dropdown and select its options by their visible labels.
- Android ListItem also drops its `testID` prop. The shared `ListItem` Android adapter supplies the equivalent Compose test-ID modifier so row selectors are retained. `UniversalListItem` directly aliases that adapter.
- Spacer is a layout element; assert the positions of its `-start` and `-end` siblings instead of trying to tap it.
- Native test IDs' visibility to a specific automation driver must be verified on a device. Bundling and typechecking do not inspect the accessibility hierarchy.

For example, after selecting **Universal Bottom Sheet → Closed**, tap `expo-ui-bottom-sheet-open`, assert `expo-ui-bottom-sheet-title`, tap `expo-ui-bottom-sheet-close`, then assert that `expo-ui-bottom-sheet-state` contains `Closed`.

For **Universal List → Default**, tap `expo-ui-list-row-2` and assert that `expo-ui-list-status` contains `Selected row: 2`.
