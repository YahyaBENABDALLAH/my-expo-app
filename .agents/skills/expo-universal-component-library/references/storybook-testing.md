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
Keep Storybook imports out of production code.

After story changes, run npm run storybook:generate, lint and typecheck.
Automated suites and Maestro flows have been removed; read package.json before
choosing commands. Keep existing selectors and manually exercise activation,
disabled suppression, value retention, validation, dismissal and retry on devices.

JS mocks do not establish SwiftUI/Compose layout, keyboard behavior, accessibility,
colors or touch geometry. Report native execution separately. Registration or
a screenshot alone does not prove those behaviors.
