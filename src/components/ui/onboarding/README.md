# Onboarding page

`OnboardingPage` renders the shared first-launch presentation. The feature owns
Expo Router navigation and persistence; this component receives the photo,
category, title, description, step, action callbacks, and saving/error state.

Photos are bundled locally and passive. All text and controls use Expo UI. Three
Host boundaries reserve a fixed header and bottom action while the middle content
can scroll on smaller devices or with enlarged text. There are no RN content
stacks inside a native Host. Safe-area padding is applied to the native header and
footer content; the viewport boundaries own the tablet width limit.

A horizontal swipe invokes the same Next/Previous callbacks, with RTL direction
reversed. Swiping past the last page never completes onboarding. Vertical scrolling
remains available; swipe and button input are disabled during persistence. Native
Router transitions honor reduced motion.

The component consumes shared `background`, `text`, `muted`, `border`, and `tint`
roles. The primary action preserves native press feedback and has aligned native
surface and touch bounds. Arabic keeps the platform font without letter spacing.

`Pages/Onboarding` supplies discover/cook/save, light/dark, pending, and save-failure
stories with interactive navigation and completion/replay.

Android verification used the production component in an isolated SDK 57 native
preview at 411 × 914 dp, French, light theme, and font scales 1.0 and 1.5. All three
pages rendered within the safe areas; Next presses at both vertical edges,
Previous, photo swipes in both directions, and completion produced the expected
state. The first-launch Maestro flow covers these navigation outcomes and
persistence, but could not run against the full app because its current native
build fails. iOS rendering, native RTL, and dark mode remain unverified on device.
