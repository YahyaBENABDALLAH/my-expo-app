# Native stories and verification

Keep two groups: Components and Forms. Current discovery and source live in
[the Storybook guide](../../../../docs/storybook.md),
[component stories](../../../../.rnstorybook/stories/components/) and
[form stories](../../../../.rnstorybook/stories/forms/).

Use typed stories, public production UI, local state and deterministic fixtures.
Forms do not call the backend. NativeStoryFrame provides the finite RN bridge
width needed by standalone controls; content controls reuse their owning Host.
The shared preview owns the theme. Use Controls for appearance and simple prop
variations, with separate fixtures only when behavior needs a different setup.
Keep Storybook imports in `.rnstorybook/` and the explicit `src/features/storybook/`
development entry. `npm run storybook` opts into the route and exposes a Home link;
the ordinary catalog uses `EXPO_PUBLIC_ENABLE_DEV_SCREENS`. Follow the canonical
guide for launch, direct fixture/canvas URLs and matching brand/build selection.

After story changes, run npm run storybook:generate, lint and typecheck.
Automated suites and Maestro flows have been removed; do not add a runner or
restore historical test commands unless requested. Read package.json before
choosing commands. Keep stable selectors on actual native controls and manually exercise activation,
disabled suppression, value retention, validation, dismissal and retry on devices.

JS mocks do not establish SwiftUI/Compose layout, keyboard behavior, accessibility,
colors or touch geometry. Report native execution separately. Registration or
a screenshot alone does not prove those behaviors. Follow the current preview
workflow: registration alone does not prove the opt-in route works on a device.
Check both release source maps after Metro/entry changes: Storybook must be absent,
while showcase modules remain even when the catalog route guard is false.
Clear Metro's cache after changing preview flags. Inspect emitted JS/Hermes flag
values too; original source-map text does not establish the compiled configuration.
The guide records the SDK 57 cache case and the verified client/preview values.
