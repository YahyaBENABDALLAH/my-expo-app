---
name: expo-mobile-ui-only
description: Apply this project's iOS and Android only, Expo UI only requirements when creating or changing screens, UI components, styling, navigation, or platform configuration in my-app-expo.
---

# Expo mobile UI only

Build this project for iOS and Android. Keep implementations simple and prioritize performance over decorative styling.

## Platform scope

- Target iOS and Android only. Do not add web support, web routes, browser previews, DOM components, WebViews, CSS, or web fallbacks.
- Use Expo Router for navigation. Keep routes in `src/app/` and reusable code outside it.
- Use platform-specific `.ios.tsx` and `.android.tsx` files when native APIs differ. Avoid unnecessary platform abstractions.

## UI requirements

- Use `@expo/ui` for rendered controls and UI content, including buttons, text, fields, pickers, menus, and toggles. Prefer its native SwiftUI and Jetpack Compose components.
- Do not introduce React Native UI controls, NativeWind, or third-party UI kits as substitutes.
- React Native infrastructure may support layout, safe areas, keyboard handling, and app lifecycle where needed; this does not authorize replacing Expo UI controls.
- Compose ordinary content with Expo UI `Row`, `Column` and `Spacer`. Use `nativeFillWidth`, `nativeFillSize` and `nativeRowWeight` for the necessary platform modifiers. Keep React Native `View` boundaries only where navigation, absolute overlays, keyboard handling, maps, Lottie, or Skia require them; bridge specialized RN content with `RNHostView` inside a native Host.
- A Host supplies native hosting and theme, not an ordinary content stack. Put sibling native text/controls in a Row or Column; direct siblings can overlap. The navbar story's status/action labels exercise this composition rule.
- Use `UniversalTextContent`, `UniversalButtonContent` and `LoadingContent` inside an existing Host. Their standalone counterparts own a Host for RN boundaries. Avoid nested Hosts for ordinary native composition.
- Every app button must declare an explicit supported intent; there is no default variant. Follow [the button skill](../foodiya-ui-button/SKILL.md) for current variants, Host ownership, states and supported props. Native icon-only and navigation controls retain an explicit native style in their platform adapter.
- Read the installed `@expo/ui` API and matching documentation before selecting components. If a needed component is unavailable, explain the limitation and ask before using another UI library.
- Preserve native interaction feedback and accessibility. Customize button colors through shared theme tokens; keep the native clickable area and visual surface aligned.
- For native controls over Skia/RN artwork, verify stacking and actual activation on a device. A visible accessibility node does not prove that the artwork cannot cover or intercept it; exercise upper/lower hit-area edges and disabled suppression.

## Simplicity and performance

- Use shared semantic theme tokens for colors and other necessary styling.
- Prefer native defaults. Avoid decorative animations, additional visual layers, layout measurement state, and extra dependencies unless needed for the requested behavior.
- Keep state local and minimal. Do not add memoization or complex abstractions without a demonstrated reason.
- Use Expo UI native progress controls for loading. A disabled query is waiting for a prerequisite; an offline paused query is waiting for connectivity. Neither means loading. Keep cached content during refresh, show persistent failure context with a retry control, and show an empty state only after a successful result.
- Keep the requested Lottie launch presentation: after readiness, hold for two seconds and slide out over two seconds. Reduced motion preserves the hold and skips the slide. Restoration failures must expose recovery.
- Remove obsolete web branches and unused adapters after checking all consumers. Retain cancellation, session-generation, serialized storage and duplicate-submission safeguards; their complexity addresses tested races.
- Adapt useful behavior and visual intent from `Reference/` while following these project constraints.

## Documentation and verification

- Follow the project's `AGENTS.md`. Before changing Expo or React Native API usage, read the Expo major version in `package.json` and fetch `https://docs.expo.dev/versions/v<major>.0.0/`. Use `https://docs.expo.dev/llms.txt` to find other relevant documentation.
- Use the available Expo overview and Expo UI skills for API guidance; these project requirements govern platform and UI choices.
- Run lint and typecheck after changes. Verify native iOS and Android behavior when a device or simulator is available, and clearly state any verification that could not be performed.
