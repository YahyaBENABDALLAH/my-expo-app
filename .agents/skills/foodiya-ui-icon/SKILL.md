---
name: foodiya-ui-icon
description: "Use Foodiya's public native Icon export when composing icon content and boundaries."
---

# Icon

Use Icon from @components/ui with Icon.select to choose an SF Symbol on iOS and an installed Material XML asset on Android. Read the installed Icon types before choosing an asset or accessibility prop. An icon is not an interactive button. Reuse named native icon-action adapters, and keep visible text in generic button content.

Use synchronous, literal `require()` calls for Android XML assets:

```tsx
import { Icon } from '@components/ui';

const starIcon = Icon.select({
  ios: 'star.fill',
  android: require('@expo/material-symbols/star.xml'),
});
```

The installed Expo UI Babel plugin recognizes `Icon` imports from `@expo/ui`,
not the project's public re-export. Dynamic `import()` through `@components/ui`
therefore stays a Promise and throws on Android. Keep the public entry point and
use `require()`; adding the same Babel plugin again does not extend its matching.
The project's lint rule rejects dynamic Material Symbol imports in source and
native stories. After changing an asset path, verify it exists in the installed
package; TypeScript does not validate `require()` paths. This runtime selection
does not remove the unused platform's XML assets from the bundle.

Follow the [mobile UI requirements](../expo-mobile-ui-only/SKILL.md) and
[component library](../expo-universal-component-library/SKILL.md).
The [public exports](../../../src/components/ui/index.ts) and installed
[Expo UI source](../../../node_modules/@expo/ui/src/universal/) define the contract.
