# Shared native UI

Import shared presentation from `@components/ui`. [index.ts](index.ts) is the
public entry point; its component names and props stay stable.

Each folder owns one component or a small family. Keep its implementation,
iOS/Android adapters, types and private helpers together. Every folder has a
README with its purpose, usage constraints and available story coverage.

| Need                    | Folder guides                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons and actions     | [button](button/README.md), [floating-action](floating-action/README.md)                                                                                                   |
| Inputs and forms        | [text-input](text-input/README.md), [form](form/README.md), [field-group](field-group/README.md)                                                                           |
| Selection controls      | [checkbox](checkbox/README.md), [switch](switch/README.md), [slider](slider/README.md), [picker](picker/README.md), [segmented-control](segmented-control/README.md)       |
| Lists and disclosure    | [list](list/README.md), [list-item](list-item/README.md), [collapsible](collapsible/README.md)                                                                             |
| Screen composition      | [page](page/README.md), [auth](auth/README.md), [refreshable-scroll-view](refreshable-scroll-view/README.md)                                                               |
| Theme and native layout | [host](host/README.md), [text](text/README.md), [native](native/README.md), [appearance](appearance/README.md)                                                             |
| Feedback and overlays   | [loading](loading/README.md), [toast](toast/README.md), [bottom-sheet](bottom-sheet/README.md), [skeleton](skeleton/README.md)                                             |
| Recipe presentation     | [recipe-card](recipe-card/README.md), [home-recipe-card](home-recipe-card/README.md), [recipe-stepper](recipe-stepper/README.md)                                           |
| Navigation and artwork  | [navigation](navigation/README.md), [aurora-background](aurora-background/README.md), [launch-screen](launch-screen/README.md), [map-experience](map-experience/README.md) |

## Keep it simple

- Use descriptive kebab-case filenames. A small component needs its implementation
  and README; split out files only for a real platform difference or private helper.
- Export public components from the existing `index.ts`. Additional folder
  barrels are unnecessary. The existing skeleton entry point and lazy map entry
  point retain their imports.
- Inside UI, import implementation files directly, including across component
  folders. Importing the public barrel from an implementation creates cycles.
- Keep queries, mutations, form state and workflow hooks in `src/features/`.
  Screen-specific fragments belong with their feature. Routes stay in `src/app/`.
- Keep styles beside their component and shared semantic colors in
  `src/constants/themes/`. Reuse native defaults and the existing Host.
- Stories and showcase wrappers stay in `.rnstorybook/`; production components
  must not import them.

## Native composition

Use `UniversalButtonContent`, `UniversalTextContent`, `LoadingContent` and
`SkeletonContent` inside an existing `UniversalHost`. Standalone counterparts
own a Host for React Native boundaries. Use Expo UI `Row`, `Column` and `Spacer`
for ordinary layout; a Host supplies theme and hosting, not a content stack.

Every button requires `variant`: `primary`, `secondary`, `link`, `success`,
`warning` or `destructive`.

```tsx
import { PageScreen, UniversalButtonContent } from '@components/ui';

<PageScreen title="Recipes" description="Your saved recipes.">
  <UniversalButtonContent variant="primary" label="Save" onPress={save} disabled={pending} />
</PageScreen>;
```

Translate labels in the caller with `useTranslation().t()`. Keep stable
`testID` values independent of translations.

## Maintenance

Check the [SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/) and installed
types before changing native APIs. Expo UI is pinned to unmodified `57.0.21`;
read the [native version decision](../../../docs/build-verification.md#expo-ui-version)
before changing it.

Add or update an existing native story when behavior changes. Regenerate story
registration after story edits with `npm run storybook:generate`. Run
`npm run typecheck`, `npm run lint` and affected behavioral checks. Native
rendering and interaction require a running iOS or Android app.

See the [component catalog](../../../.agents/skills/expo-universal-component-library/references/components.md)
for native API references and verification limits.
