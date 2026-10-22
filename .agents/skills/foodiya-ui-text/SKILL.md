---
name: foodiya-ui-text
description: 'Choose or maintain Foodiya native text, typography, semantic tones and hosted versus standalone rendering.'
---

# Themed text

Exports: `UniversalText`, `UniversalTextContent`, their public types and
`AuthText` (a direct alias of content).

Implementation: `universal-text.tsx`. Use the standalone component at an RN
boundary and content inside an existing Host. Supported semantic variants are
`heading`, `title`, `subtitle`, `body`, `label` and `caption`. Omit variant/font
props to keep native typography; no line height is calculated.

`tone` independently selects a semantic foreground: `default` (the `text` token),
`muted`, `primary`, `secondary`, `success`, `warning`, `error` or `info`.
Explicit `lightColor`/`darkColor` overrides take priority over the tone;
`textStyle.color` takes priority over both. Font size and weight overrides retain
their existing priority over the typography preset.

Content inherits its Host's scheme unless explicitly overridden. Keep labels
translated by callers and shared typography/theme roles in the existing tokens.

Named typography and semantic tone stories: [text.stories.tsx](../../../.rnstorybook/stories/components/text.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/text/](../../../src/components/ui/text/).
