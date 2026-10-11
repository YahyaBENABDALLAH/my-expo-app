# OTP bottom sheet

`OtpBottomSheet` presents a six-digit verification form with native Expo UI controls on iOS and Android. Import it from `@components/ui`. Control `isPresented` and `onDismiss`, supply a display `recipient`, and implement `onVerify(code)` to return acceptance or throw on request failure. The component performs no authentication or delivery itself.

Optional `onResend` enables a 30-second resend cooldown; `resendCooldownSeconds` customizes it. `hint` supplies helper copy, `colorScheme` overrides appearance, and `testID` prefixes native selectors. Successful verification shows a confirmation and Done button. Reopening clears the code and feedback. Duplicate requests are blocked; dismissed/unmounted sessions ignore late completions.

One transparent native text field sits above six decorative digit slots, preserving native paste, autofill, selection, and backspace. Input normalizes Western, Arabic, Persian and full-width digits and strips pasted separators. The numeric row has an explicit-width LTR Host so Arabic copy retains its surrounding RTL direction. Platform adapters supply overlapping native stacks because the universal API has no overlay stack.

The sheet uses the platform transition. A fixed-size RN animation boundary gives the Expo UI shield a short fade/scale and error shake, using Reanimated on the UI thread. Motion respects live reduced-motion and app activity settings. Native keyboard avoidance belongs to the sheet; the content scrolls when constrained. No dependencies or native configuration change.

Theme roles: `surfaceRaised`, `surface`, `text`, `muted`, `tint`, `selection`, `border`, `error`, `errorContainer`, `success`, and `successContainer`. Native button feedback and loading indicators remain intact. Copy is available in English, French and Arabic.

Native stories: `.rnstorybook/stories/expo-ui/otp-bottom-sheet.stories.tsx` (Light, Dark, ResendCountdown, RequestFailure, ResendFailure), with isolated English copy. Interaction flow: `.maestro/storybook/otp-bottom-sheet.yaml`. Portable checks cover digit normalization, incomplete and duplicate submissions, rejection/request failure, resend reset and stale completion after reopening. These tests mock native views. Native keyboard/autofill, narrow widths, large fonts, screen-reader traversal, hit-area edges, and motion require device verification; story registration and typechecking alone do not prove them.

The Development screen opens a local UI demo. Only `123456` succeeds; other complete codes demonstrate rejection. Resend is simulated and sends no message.
