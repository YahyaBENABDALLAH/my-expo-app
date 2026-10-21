# Storybook

Two groups:

- **Components** — reusable controls, layout, loading and feedback.
- **Forms** — a login form, field groups and OTP verification.

Use **Controls** for theme, light/dark appearance, disabled states and other
props. Separate stories are kept for interactions that need their own setup.
Text, Button and Toast also expose named semantic variants for quick discovery.
Skeleton includes line, avatar, image and card placeholders. Icon and Floating
Action demos, the closed-only sheet, and Page Header's animated LTR/RTL and
Settings previews are intentionally excluded.
Forms use local fixtures and never send credentials to a backend.

Run `npm run storybook` and open the app's Storybook tab. After adding or moving
a story, run `npm run storybook:generate`.

The shared preview owns the story theme. `NativeStoryFrame` supplies the finite
native bridge width required by standalone controls. Keep stories outside
production imports and use the wrappers exported from `src/components/ui`.

Run `npm test` for component/form checks. See
[native testing](../docs/native-ui-tests.md) for device tests.
