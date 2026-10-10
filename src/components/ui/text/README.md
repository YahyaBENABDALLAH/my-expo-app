# Themed text

Exports: `UniversalText`, `UniversalTextContent`, their public types and
`AuthText` (a direct alias of content).

Implementation: `universal-text.tsx`. Use the standalone component at an RN
boundary and content inside an existing Host. Supported semantic variants are
`heading`, `title`, `body` and `caption`.

Content inherits its Host's scheme unless explicitly overridden. Keep labels
translated by callers and shared typography/theme roles in the existing tokens.

Existing composition story: [text.stories.tsx](../../../../.rnstorybook/stories/expo-ui/text.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
