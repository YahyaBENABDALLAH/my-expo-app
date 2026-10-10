# Native authentication

The iOS/Android auth screens adapt `Reference/`'s palette, spacing, decorative heading font, and form layout. Each `AuthScreenFrame` owns one `@expo/ui` Host with the auth scheme and seed color. Native ScrollView and Column layouts contain host-free AuthText, UniversalButtonContent, FormTextInput, and FormSubmit content. React Native keyboard avoidance stays outside the Host. The Likan brand stays in the screen header.

Keep React Native View and RNHostView out of this continuous native tree. UniversalTextContent and UniversalTextInputContent compose inside an existing Host; UniversalText and UniversalTextInput remain explicit adapters for React Native layouts elsewhere. The native input content needs no JavaScript width measurement. Native width modifiers and the screen's capped content width constrain the form. Follow the [SDK 57 Host boundary rules](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/#placing-components-inside-react-native-views), also researched through Context7's Expo index. The session-restoration panel owns its own Host rather than adding one to each auth control.

Storybook's Expo UI/Auth Screen stories exercise the actual frame, fields, password button, submit states, and text with one Host and no backend calls. Run `.maestro/storybook/auth-screen.yaml` on both platforms to check validation, editing, one callback per press, and pending-state suppression. Repeat with the device in light/dark appearance; story registration alone does not verify native layout or interactions.

Auth buttons use native SwiftUI/Compose controls with colors from `authButtonTokens`. They retain native shapes, padding, typography, disabled states, and press feedback. Full-width sizing happens natively inside the interactive surface; no JavaScript width measurements, custom painted background, or custom press animation is used.

## Configuration

Set `EXPO_PUBLIC_API_URL` to the HTTPS Identity API origin in `.env.local`, without a trailing `/api`. Restart Metro after changing it. `.env.local` is ignored by Git. The server must be reachable from the device.

## Routes and state

- `/login`: email or username and password; `/register`: username, first name, last name, email, password, and local password confirmation.
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

API failures use the app's shared Expo UI toast flow, including login, registration, verification/resend, recovery/reset, account reads, logout, and background token refresh. Auth forms retain entered values for retry; only client-side validation stays inline. See [error notifications](api-services.md#error-notifications) for cache callbacks, retry timing, platform behavior, and regression coverage.

## Verification

Run `npm run typecheck`, `npm run lint`, and `npm test`. Session and interceptor tests execute production modules with fake native storage and network transport, including concurrent refresh, late 401s, failed persistence, and account-change races.

Run `npm run test:e2e:auth` with Maestro and a signed-out development build connected to Metro. These flows check invalid submissions, password visibility, corrections, and navigation without sending valid forms to the backend. Live login, registration/OTP, recovery email delivery, keyboard layout, custom font rendering, and accessibility identifiers still need device verification.

Selectors retain `auth-login-email` for the email-or-username field. Registration uses `auth-register-username`, `auth-register-first-name`, `auth-register-last-name`, `auth-register-email`, `auth-register-password`, and `auth-register-confirm-password`. Field errors append `-error`. Login and registration have person/mail/lock left icons; password and confirmation use an inline eye action (`-right-icon`) with Show password / Hide password accessibility labels. Each field keeps independent visibility state, starts masked, and disables its action while pending. `FormTextInput.passwordToggle="icon"` selects this composition; other forms retain the existing text button (`-visibility`). Native auth Storybook includes PasswordIcons and PendingPasswordIcons. Maestro login/register flows check revealed values and masking; device execution remains pending. Verification uses `auth-verify-code`, `auth-verify-submit`, and `auth-verify-resend`. API notifications use the root `error-toast` overlay; iOS text and dismissal selectors are `error-toast-message` and `error-toast-dismiss`, while Android uses native Snackbar accessibility. Account uses `auth-account` and `auth-logout`.
