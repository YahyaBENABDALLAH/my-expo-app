# OTP bottom sheet

`OtpBottomSheet` presents a six-digit verification form with native Expo UI controls on iOS and Android. Import it from `@components/ui`. Control `isPresented` and `onDismiss`, supply a display `recipient`, and implement `onVerify(code)` to return acceptance or throw on request failure. The component performs no authentication or delivery itself.

It uses the shared native `BottomSheet`, without shell styling or extra padding.
OTP adds the verification form and bounded scrolling; it has no separate sheet
styling or presentation behavior. The iOS drag indicator is hidden.

Optional `onResend` enables a 30-second resend cooldown; `resendCooldownSeconds` customizes it. `hint` supplies helper copy, `colorScheme` overrides form appearance, and `testID` prefixes native selectors. Successful verification shows a confirmation and Done button. Reopening clears the code and feedback. Duplicate requests are blocked; dismissed/unmounted sessions ignore late completions.

One transparent native text field sits above six decorative digit slots, preserving native paste, autofill, selection, and backspace. Input normalizes Western, Arabic, Persian and full-width digits and strips pasted separators. The numeric row has an explicit-width LTR Host so Arabic copy retains its surrounding RTL direction. The OTP form measures its own native input section; the input mounts once that measurement is available and retains its value across resizing. Their explicit height grows for larger font scales. Inset rounded fills draw complete borders on both platforms; iOS uses a plain field so native field chrome does not cover the slots. Platform adapters supply overlapping native stacks because the universal API has no overlay stack.

Opening resets React form state before committing the presentation and clears the existing native value in a layout effect. It does not force a keyed form remount; the platform sheet still owns its native mounting and dismissal lifecycle. The resend countdown owns its own React state and stops its timer at zero, on dismissal, or when the resend action is absent. Countdown ticks do not render the form or native input. Feedback allocates animation hooks only while visible. Verification, resend and stale-completion guards remain active.

The form follows the supplied reference: leading-aligned heading and delivery copy, a bold recipient, six empty rounded boxes with neutral fills, and a stronger text-colored focus outline. Filled boxes keep their neutral appearance; rejected codes use the error palette. Only supplied hints, resend confirmation and errors add helper text. The existing UniversalButtonContent verification and resend controls retain their styling and behavior.

The sheet uses the platform transition. Status artwork is shown only after successful verification, with its existing short fade/scale. Motion respects live reduced-motion and app activity settings. Native keyboard avoidance belongs to the sheet. The scroll viewport is limited to 70% of the current window height, capped at 620 points/dp. This gives the intrinsic sheet Host a finite scrolling height on opening and window resizing; an unbounded vertical scroll can throw during Compose measurement. The scroll has no width-only frame modifier that would override its height on iOS. No dependencies or native configuration change.

Theme roles: native light/dark appearance for the sheet shell, plus `surfaceVariant`, `text`, `muted`, `border`, `error`, `errorContainer`, `success`, and `successContainer` for the form and the unchanged shared button palette. Native button feedback and loading indicators remain intact. Copy is available in English, French and Arabic.

Native stories: `.rnstorybook/stories/expo-ui/otp-bottom-sheet.stories.tsx` (Light, Dark, ResendCountdown, RequestFailure, ResendFailure, LongRecipient), with isolated English copy. Interaction flow: `.maestro/storybook/otp-bottom-sheet.yaml` includes input readiness on opening and reopening before typing. Portable checks cover digit normalization, incomplete and duplicate submissions, rejection/request failure, resend reset and stale completion after reopening. They also check immediate input before geometry callbacks, local input-width updates, preserved input identity, and render counts throughout countdown, expiry and dismissal. Viewport checks cover opening, resizing and reopening on both platforms; digit checks exercise the installed iOS style translator to retain equal widths and explicit heights, including a narrow row and larger font scale. These tests mock native views. Native keyboard/autofill, narrow widths, large fonts, screen-reader traversal, hit-area edges, and motion require device verification; story registration and typechecking alone do not prove them.

The Development screen opens a local UI demo. Only `123456` succeeds; other complete codes demonstrate rejection. Resend is simulated and sends no message.

The 2026-10-13 performance changes pass lint, typecheck and the layout regression
suite. Android Maestro reached the OTP story but did not complete its first
opening assertion; a follow-up run failed to initialize instrumentation, and the
physical device disconnected before its run. Native interaction and release-build
opening latency remain unverified, as does iOS execution on this Windows host.
