# Middle-button wave verification

## Edge-to-edge dock and page overlap (2026-10-11)

The dock is now rectangular and borderless, with no decorative left/right or
bottom spacing. Its glass reaches the physical screen edges; native destination
controls retain side cutout protection and the bottom system gesture area remains
below the controls. The 84-point action frame overlaps the page by 28 points,
reserving only the 56-point dock plus the actual bottom safe-area inset. The
transparent frame passes touches beside the action through to the page, while
the complete floating button remains inside its parent's touch bounds.

`PageOverlap` adds a page control next to the raised action and exposes its press
count. The existing navigation Maestro flow now exercises its lower edge and the
floating action's upper edge. ADB reports no connected Android device; native
iOS/Android rendering, safe-area appearance and touch delivery remain unverified.
Lint, typecheck and all 150 layout checks pass; Storybook registration was regenerated.
Earlier rounded geometry and full 84-point layout descriptions below are historical.

## Light-mode dock shadow (2026-10-04)

The grey halo in the Home screenshot comes from the dock, control clip and raised-action surround using Android elevations of 8, 9 and 10. React Native elevation generates its own native drop shadow, independently of `shadowOpacity`; the light background makes it conspicuous. All three elevations and the dock shadow are now disabled in light mode. Existing `zIndex` values preserve their visual order. Dark-mode values and the native glass finish are unchanged. The shared top wave animation is unchanged, while all PageScreen pages now use the Home title style with an optional native back arrow and no duplicate native toolbar.

The existing Light/Dark and glass navigation stories cover the dock. The shared header stories and `.maestro/storybook/page-header.yaml` cover both themes, repeated back-arrow activation and arrow absence on tab headers. Native appearance and touch stacking remain unverified: `adb devices` reports no connected device.

Validation: lint, typecheck, formatting, all 68 navigation/layout tests and the focused header/dock prop harness pass. The harness verifies one shared title, arrow presence only on standalone pages, back/Home fallback and override delivery, top/bottom/side inset ownership, no light-mode elevation/shadow, and retained dark elevation values. iOS and Android production JavaScript/Hermes exports compile into `.expo/header-check/export`; this verifies native module/asset resolution and compilation, not on-device appearance or event delivery. Story registration was regenerated. Initial unrelated bottom-sheet and palette check failures were resolved by concurrent work; a test helper display-name lint issue was corrected without changing its behavior.

## Production-fix verification follow-up

The status/action labels now use Column instead of overlapping Host siblings. The dock uses one weighted Row with a center Spacer. FloatingAction now hosts RN artwork through a native Box/ZStack adapter; Android gives the control layer an explicit native zIndex. Passive RN touch observation schedules the existing feedback on the UI runtime, while only the native button invokes the action. The former scoped Gesture.Native observer/root is removed. The existing wave paths, motion guards, timing and native activation fallback are retained.

The updated numeric callback harness passes growth/dip/settling, cancellation, context changes, disabled/static/reduced-motion guards and one action per simulated native event. All 112 offscreen Skia frames pass clipping, fill and period checks. These checks mock native event delivery. Earlier Android runs exposed the hidden/unresponsive action; the final adapter retest reached story opening but stopped when the ADB/gRPC connection closed. Final navbar native activation and iOS interaction remain unverified. See [production fixes](production-fixes-plan.md). Earlier sections below are historical verification snapshots.

## Current glass and tap response — 2026-10-04

Dock clipping follow-up: the 56-point tab row now clips its native children to the same 28-point rounded outline as the glass dock. This addresses the mismatch between individually rounded tab ripples and the dock's curved ends after removing its vertical padding. An 84-point center spacer reserves the previous geometry; the raised action is a sibling overlay contained within the full 84-point frame, above the dock and outside its clip. `DockFeedback` provides a static interactive story for holds at the curved ends in either theme. The navigation Maestro flow adds top-edge tab taps and taps near the raised action's top/bottom. These native checks remain unexecuted without a connected device. [React Native's clipping guidance](https://reactnative.dev/docs/0.86/view-style-props#borderradius) supports combining the rounded radius with hidden overflow; lint/typecheck cannot verify the resulting native ripple.

This follow-up passes targeted navbar ESLint, focused formatting, all 20 navigation tests, and all eight layout tests. Storybook registration was regenerated. The full-project lint and typecheck were run but currently fail in unrelated toast/auth files (`error-toast.android.tsx`, auth form Control types, and required `onEdited` callbacks). No navbar type errors were reported. `adb devices` still reports no connected device, so native clipping and the extended Maestro flow remain unverified. The earlier full-project successes below describe previous iterations.

The navbar now uses an 84-point interactive row and a 56-point dock aligned with the native tabs. Extra padding above/below the tabs and the minimum 10-point bottom gap are removed; the outer frame reserves only the actual bottom safe-area inset. The fixed 84-point center slot still contains the raised action. The iOS glass surface fills its host instead of imposing a 76-point height. Existing Light, Dark, SafeArea, NarrowPhone, and Static stories cover the updated composition; native layout inspection remains pending. Its surface has rounded glass, a subtle glint, and translucent light/dark theme tokens. iOS uses Expo UI Liquid Glass on iOS 26+ and a thin native material on earlier versions. Android 12+ uses Expo Blur's SDK 57 target API with a local tonal backdrop; earlier Android retains the tinted surface. The blur target contains only the backdrop and never its own blur or controls. Because the bar remains in normal layout, Android blurs this local decorative backdrop rather than scrolling screen content.

Feedback starts at touch-down on the UI runtime. A scoped Gesture Handler root and non-cancelling native gesture observer preserve the Expo UI button's activation and accessibility. Native activation starts feedback if no burst is running, covering accessibility and keyboard activation. Finger release continues the existing response instead of restarting its first stage, avoiding a hitch during quick taps.

The user's latest timing preference is slower, smoother motion. The size pulse grows to 105.5%, dips to 94%, and settles to 100% over 600 ms (160/200/240 ms), using ease-in-out curves with soft turnarounds. A one-second liquid burst ramps up over 180 ms and settles over 820 ms; peak wave speed is reduced to 2.4x. It still increases amplitude and surface shift and strengthens lighting, shading, and rim highlights for depth. The action executes immediately and only through the native button. New touches restart the response from its current value; cancelled touches settle within 120 ms. Independent four-second breathing stays calm as the liquid accelerates. Combined maximum growth is 82.99 points, within the existing 84-point surround. Static, disabled, reduced-motion, background, and unfocused states suppress or reset this motion.

`GlassAndTap` and `DarkGlassAndTap` native Storybook compositions cover the new finish and response. The navigation Maestro flow also checks repeated enabled taps and disabled suppression; it has not been executed without a device.

The production Skia JSX, path constants, and transforms are rendered offscreen by `.expo/navbar-enhancement-check/verify.cjs`. All 112 frames (seven action contexts, two themes, four phases, resting and maximum burst) pass circular clipping and opaque center/base checks. Both resting and burst loop endpoints match exactly, and burst artwork differs visibly from resting artwork at the same phase. PNGs are saved in that directory. This checks drawing and static geometry; it does not verify native glass, animation timing, touch delivery, haptics, accessibility, or frame rate.

The interaction harness `.expo/navbar-glass-check/verify-interaction.cjs` invokes the production callbacks with the installed Reanimated numeric timing, sequence, easing, and value-setting algorithms. It verifies growth before native activation, uninterrupted continuation on release, a visible dip, settling, single action delivery, repeated activation, cancellation, context updates during the pulse, static/disabled/reduced-motion suppression, and accessibility activation. The latest timing refinement passes this harness, lint, typecheck, and focused formatting. React/native event delivery and runtime decoration are mocked; this does not establish that native touch events are delivered on a device.

Storybook registration was regenerated for the existing glass stories. Prior to the latest timing refinement, production iOS and Android JavaScript/Hermes exports compiled into `.expo/navbar-tap-check/export-ios/` and `export-android/`. Android tooling reported no connected device; native rendering and interaction verification remain pending. These details supersede older descriptions below.

## Previous navbar enhancement — 2026-10-04

The navbar now sits in a rounded dock with selected native icon capsules, a thin themed border, and a softer shadow. Its outer frame reserves the raised button's space and owns the real bottom safe-area inset, using a minimum 10-point bottom gap. The fixed center slot protects the 76-point native action's width on narrow phones. The action retains its calm four-second, 100%-to-103.5% breathing motion, native activation, and existing haptics.

The interactive row is 96 points tall, with the entire 84-point action surround inside its bounds. The raised control uses normal layout; only the decorative dock is absolutely positioned. The row sits above the dock's Android elevation. This avoids relying on touch delivery outside an ancestor's frame; actual top-edge tapping still needs a native device check.

Skia now draws two liquid layers moving in opposite directions. Both reuse one smooth cubic path built at module load; a fine crest and a highlight synchronized with breathing add depth. The liquid paths extend below the circle so amplitude changes cannot uncover the base. One UI-thread frame callback drives all continuous motion, with no per-frame React state or path construction. Motion stops for static, disabled, unfocused, background, and reduced-motion states. The shared motion hook also listens for accessibility-setting changes while the app is running.

Native Storybook includes context switching, 34-point bottom insets, asymmetric side cutouts, a 320-point phone, and the hidden creation route. The dedicated `.maestro/storybook/reference-navigation.yaml` flow checks selection and context labels, single enabled activation, and disabled suppression.

Artwork verification uses the production JSX, path constants, and transforms extracted by `.expo/navbar-enhancement-check/verify.cjs`. All 56 offscreen frames (seven contexts, light/dark, four phases) pass circular clipping and opaque center/base checks. Every context visibly changes between start and half-cycle, and all loop endpoints match exactly. PNGs are saved in the same directory. This verifies Skia drawing, not native controls, animation timing, or frame rate.

Lint, typecheck, targeted formatting checks, all 20 navigation tests, and all six layout tests pass. Storybook registration was regenerated. Final iOS and Android production JavaScript/Hermes exports compile into `.expo/navbar-enhancement-check/export-ios/` and `export-android/`.

Android tooling reports no connected device. Native iOS/Android appearance, hit targets, accessibility announcements, setting changes, background handling, haptics, and release-device performance remain unverified. These current details supersede the historical visual and motion descriptions below.

## Earlier iterations

Updated 2026-10-03. The reference navbar retains its four destinations, raised 76-point center button, native Expo UI controls, and context-specific palette. The requested 3D treatment adds a soft upper-left radial highlight, lower shading, and a thin lit rim inside the circle. It uses static gradient draws; no blur filter, extra Canvas, animation loop, or dependency was added.

## Optimization

The previous wave allocated a Skia path and evaluated roughly twenty sine points every frame. The new wave builds a three-period path once when the module loads and animates only its horizontal translation on the UI thread. Period-aligned vertices prevent a visible reset at the loop boundary. There is no per-frame React state update. Existing reduced-motion, background, disabled, focus, and cleanup handling remains in place. Native button semantics and hit geometry are unchanged.

## Verification

- Lint and typecheck pass.
- Skia CanvasKit rendered the production JSX and its path constants offscreen at four phases (start, quarter, half, end). The script extracts the actual artwork from `floating-action.tsx`; it does not recreate a separate illustration.
- Circular clipping and visible wave movement pass. Start and end frames have zero differing color channels, confirming a seamless loop in this renderer. Half-phase movement changes 2,265 channels.
- Both iOS and Android production JavaScript/Hermes exports compile. Final exports are under `.expo/navbar-depth-check/`.
- Native stories include light/dark, creation, active filters, disabled, and static modes. Storybook uses the same production composition.
- Android tooling reports no connected devices. Native touch behavior, accessibility announcements, background/reduced-motion execution, native screenshots, FPS, battery usage, and release-device performance remain unverified. CanvasKit output verifies drawing and continuity; it does not establish native frame rate or native control rendering.

Offscreen verification script and images are saved locally under `.expo/navbar-depth-check/`. The PNGs contain Skia artwork only; the Expo UI icon and native button are layered over it in the app.

## Press feedback

The middle button now scales to 97% over 100ms on touch-down and returns over 150ms on release or cancellation. While held, its existing wave grows to 1.7x its resting amplitude and moves 2.8x faster. Agitation fades over 250ms after release. Native Gesture Handler observes the hosted control; the Expo UI button still owns activation, disabled behavior, accessibility, and haptics. Native gesture infrastructure is scoped to this component so the same composition works in Storybook.

The existing periodic path is reused. One UI-thread frame callback advances phase continuously at the current speed, without resetting phase on touch or rebuilding paths. The callback stops when motion is disabled or the component is hidden/backgrounded/unmounted. Scale and agitation reset when motion becomes unavailable. Reduced motion and Static stories suppress both effects. `PressFeedback` supports manually checking quick taps, holds, interrupted gestures, and one native action per successful press. Native gesture delivery and visual timing remain unverified until a device is connected.

Press artwork verification also rendered the 1.7x-amplitude transform offscreen: it visibly differs from the resting wave and remains clipped to the circle. Resting loop endpoints remain identical. This checks Skia geometry, not native touch delivery or time-based frame rate. Press-check exports are saved under `.expo/navbar-press-check/`.

Click-feedback refinement: the size dip is now 92%, with a full 230ms pulse after successful activation so quick taps remain visible. A 290ms wave burst accompanies the click, including accessibility activation; the action itself runs immediately. Haptics now use Medium impact on iOS and the native Context_Click effect on Android. Reduced motion still suppresses visual pulses. Native feel remains unverified without a device.

## Current motion: breathing

The user's latest preference replaces the sharp press animation with a calm continuous breathing motion. One four-second inhale/exhale cycle gently expands the entire button from 100% to 103.5% and returns to 100%, with cosine easing at both turnarounds. The wave moves at a steady, slower speed and its amplitude varies subtly with the same breath. There is no custom click shrink or agitation burst, and the gesture observer/root wrapper has been removed. Native Expo UI controls retain normal activation and feedback. The existing haptic click remains.

One UI-thread frame callback drives both breath and the prebuilt wave. Reduced motion, Static mode, disabled state, backgrounding, and navigator blur stop the callback and reset the button to its resting size. The Breathing story replaces PressFeedback. This section supersedes previous custom press/click descriptions. Native appearance and pacing remain pending device verification.
