# Native authentication

The iOS/Android auth screens share native form layout and the configured brand's wordmark and heading font. Each `AuthScreenFrame` owns one `@expo/ui` Host with the app scheme and seed color. Native ScrollView and Column layouts contain host-free UniversalTextContent, UniversalButtonContent, FormTextInput, and FormSubmit content. React Native keyboard avoidance stays outside the Host. [Bundled assets](assets.md) explains font selection and Arabic fallback.

The shared [auth UI family](../src/components/ui/auth/) owns the screen frame.
Login owns its [preferences bar](../src/features/auth/login-preferences.tsx)
in the auth feature. The [auth UI skill](../.agents/skills/foodiya-ui-auth/SKILL.md)
defines their composition contract.

All auth screens share `AuthScreenFrame` and automatically fill the available width with safe gutters and keyboard avoidance. There is no maximum content width. Short forms center vertically within the Host's actual available height; longer content grows and scrolls. The native minimum-height modifiers preserve natural content height, including validation messages and larger text. No device checks or tablet breakpoints are needed.

Registration uses the frame's `grouped` mode with a full-height Expo UI `FieldGroup` as its only scroll container. Profile, account/security, preferences, and getting-started sections contain the existing form fields, a preferred-language `Picker`, and two informational `ListItem` rows. The picker defaults to the current app language and submits `preferredLanguage` with the registration request; its choices use language autonyms. First and last names remain optional. All fields, the picker, and auth actions disable during submission. Keep this native form out of an enclosing ScrollView or List to avoid nested scroll containers. Its stable selectors include `auth-register-scroll`, `auth-register-language`, and `auth-register-account-list`.

Keep React Native View and RNHostView out of this continuous native tree.
`TextInput` accepts a string value and composes inside the existing Host;
`FormTextInput` binds React Hook Form to it. The input owns native value/reset
synchronization without measuring width in JavaScript. At RN boundaries, supply
a `UniversalHost` explicitly. Native width modifiers stretch the form within
the available Host width. Follow the [SDK 57 Host boundary rules](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/#placing-components-inside-react-native-views).
The session-restoration panel owns its own Host rather than adding one to each auth control.

Storybook's Forms/Login Form stories exercise the actual frame, fields, password button, submit states, and text with one Host and no backend calls. Check validation, editing, one callback per press, and pending-state suppression manually on both platforms. Repeat with the device in light/dark appearance; story registration alone does not verify native layout or interactions.

Auth buttons use native SwiftUI/Compose controls with shared semantic button tokens. They retain native shapes, padding, typography, disabled states, and press feedback. Full-width sizing happens natively inside the interactive surface; no JavaScript width measurements, custom painted background, or custom press animation is used.

## Configuration

Login uses normal validation and real authentication in every build. There is
no local credential bypass or development guest session. Public starter screens
can open without backend credentials; Account requires a real session.

After successful login, the form stays disabled while the wave rises for one
second. Navigation opens Home when the animation completes. Reduced motion skips
the transition and opens Home immediately.

Set `EXPO_PUBLIC_API_URL` to the HTTPS Identity API origin in `.env.local`, without a trailing `/api`. Restart Metro after changing it. `.env.local` is ignored by Git. The server must be reachable from the device.

## Routes and state

- `/login`: email or username and password; `/register`: username, optional first/last names, email, password, local password confirmation, and preferred language.
- `/verify-email`: transient six-digit challenge, expiry, confirmation, and server-controlled resend cooldown. Opening this route without a challenge returns to login.
- `/forgot-password`: send recovery instructions and show a generic confirmation after success.
- `/account`: signed-in identity query, offline saved identity, retry, and logout.

Auth routes share `src/app/(auth)/_layout.tsx` and its transient flow provider. The root uses native protected groups with predicates in `src/guards/`. Session restoration finishes before route selection; storage-read failures show a retry action. Authenticated users cannot return to auth screens through back navigation. Returning from registration or recovery preserves the existing login draft. Leaving a form invalidates its pending flow response.

`src/services/api.ts` adapts the reference Axios client: bearer metadata, typed API errors, one retry after shared token rotation, and checks that prevent old requests from returning data after account changes. `src/services/auth/` owns auth endpoints, installation metadata, SecureStore storage, refresh, restoration, and logout. Tokens are stored together; passwords and verification codes are never persisted. Temporary refresh failures preserve the session; explicit invalid-session codes remove it. Logout attempts server revocation and clears locally even offline. A local storage deletion failure remains retryable.

TanStack Query mutations handle submissions with retries disabled. They fail promptly offline rather than queueing credentials. The shared QueryClient clears when accounts change. AppState and Expo Network drive native focus/reconnect behavior. `auth.queries.ts` contains the current-identity query, keyed by user ID.

## API contract

DTOs in `src/types/auth.types.ts` mirror the reference Identity snapshot. Login accepts `login`, not `email`; login and confirmation include a persisted device installation ID. Registration excludes the local confirmation field. Login and registration may return either an OTP challenge or a validated token response.

Recovery currently returns only `{ message }`, while resetting a password requires a `challengeId`. The reference does not specify how that ID is delivered. The recovery request and confirmation are implemented; a reset-completion screen awaits that delivery contract. Google sign-in is outside this phase.

Validation follows the reference DTO limits: identifier 3–256 characters, password 8–128, username 3–50, names up to 100, email up to 256, and exactly six code digits. Registration/recovery emails are trimmed and lowercased; login identifiers are trimmed without changing case; password whitespace stays significant. Native field errors appear after blur or submission.

API failures use the app's shared Expo UI native alerts, including login, registration, verification/resend, recovery/reset, account reads, logout, and background token refresh. Auth forms retain entered values for retry; only client-side validation stays inline. See [error notifications](api-services.md#error-notifications) for cache callbacks, cancellation filters and presentation.

## Verification

Run `npm run check` for TypeScript, lint and formatting. Automated form suites have been removed; component and story test IDs are retained for future coverage.

Use Storybook's local form and OTP fixtures for manual interaction checks. Verify live authentication, recovery delivery, keyboard layout and accessibility on iOS and Android devices.

Selectors retain `auth-login-email` for the email-or-username field. Registration uses `auth-register-username`, `auth-register-first-name`, `auth-register-last-name`, `auth-register-email`, `auth-register-password`, and `auth-register-confirm-password`. Field errors append `-error`. Login and registration have person/mail/lock left icons; password and confirmation use an inline eye action (`-right-icon`) with Show password / Hide password accessibility labels. Each field keeps independent visibility state, starts masked, and disables its action while pending. `FormTextInput.passwordToggle="icon"` selects this composition; other forms retain the existing text button (`-visibility`). Use the Login Form story with the icons/pending Controls for password visibility and disabled states; device execution remains pending. Verification uses `auth-verify-code`, `auth-verify-submit`, and `auth-verify-resend`. API notifications use the root `AlertHost`; native message and OK controls use `app-alert-message` and `app-alert-dismiss`. Account uses `auth-account` and `auth-logout`.
