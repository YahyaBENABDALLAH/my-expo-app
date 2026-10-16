# Onboarding page

`OnboardingPage` renders a complete introduction carousel inside one screen. Pass
an ordered `pages` array (`id`, photo, category, title, description), completion and
skip callbacks, saving/error state, and an optional color scheme. `initialStep` is
read on mount for deterministic stories. The feature supplies translated content
and owns persistence; slides never navigate through Expo Router.

The wordmark/Skip header and progress/Previous/Next footer stay mounted in fixed
native Hosts. Only the middle content slides. Each slide has an independent
vertical Expo UI ScrollView for compact devices and enlarged text. Photos are
bundled locally, passive, and bridged with RNHostView; all ordinary content and
controls remain native Expo UI. Safe areas and a 480-point content width limit
apply to the persistent screen.

Private platform adapters use SwiftUI TabView with page style on iOS (including
iOS 16.4) and Compose HorizontalPager on Android. Both inherit the Host's layout
direction, including Arabic RTL. Next and Previous update local selection and
animate the content; reduced motion removes programmatic paging animation.
Android hardware Back returns to the previous slide before allowing exit from
the first. Swiping to or beyond the last slide never completes onboarding.

During persistence, the pager cannot receive touches and all actions are disabled.
Failed saves keep the final slide available for retry. Shared background, text,
muted, border and tint roles supply colors. Native button surfaces and clickable
bounds remain aligned. Arabic retains the platform font without letter spacing.

`Pages/Onboarding` reuses the production component with discover/cook/save,
light/dark, saving, failure, completion and replay fixtures. JS checks verify
persistent screen identity, local selection, completion, retry and disabled-input
behavior. `.maestro/onboarding/first-launch.yaml` exercises native swipes, button
navigation, hardware Back and completion. Native verification for this revision
is recorded in the component catalog; mocked tests do not prove native geometry.

On iPhone 18 Pro / iOS 27, the French light-theme screen was checked for all three
slides, a fully visible final description, fixed header/footer, Previous, Next at
both vertical touch edges, and completion returning to sign-in. Native swipe
gestures could not be confirmed through the available desktop automation.
Android, RTL, dark mode and enlarged-text rendering remain unverified on device.
Storybook itself currently fails with a duplicate RNCSafeAreaProvider registration;
these checks used the production first-launch route directly.
