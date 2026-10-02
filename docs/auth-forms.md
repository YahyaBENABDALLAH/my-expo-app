# Authentication screens and validation

Open the **Account** tab to reach login. The standalone routes are `/login`, `/register`, and `/forgot-password`, including their native links such as `myappexpo://login`.

This is a screens-and-validation implementation. Submitting valid details shows validation feedback only. It does not create an account, establish a session, or send a reset email. Credentials are kept in the form's memory; they are not logged or persisted.

## Source folders

- `src/app/(auth)/`: thin route files, hosted directly by the root native stack in `src/app/_layout.tsx`.
- `src/features/auth/screens/`: login, registration, and forgot-password screens.
- `src/features/auth/components/`: keyboard-aware frame, React Hook Form field adapter, and submit feedback.
- `src/features/auth/hooks/`: validation-only submission, idle screen prefetching, and return navigation.
- `src/validation/schemas/auth.ts`: Zod schemas and inferred form types.
- `src/validation/resolvers/auth.ts`: React Hook Form Zod resolvers.

Native text inputs and buttons use the existing universal Expo UI wrappers. `FormTextInput` adapts native observable text state to React Hook Form, forwards blur and focus refs, and keeps external form resets synchronized. Password visibility changes retain the native text state.

Login prefetches registration and password reset in separate idle callbacks while focused. Both forms can prepare their Expo UI hosts and input measurements off-screen without adding navigation history. Pending callbacks are canceled when Login loses focus. Auth routes share the root native stack, avoiding a nested auth navigator that would group both prefetch targets into one preloaded route. Navigation dismisses the keyboard without adding a timer; the stack uses native transition timing and fades for reduced motion. Its background matches the form theme, and headers remain transparent.

Run `npm run test:navigation` to check route discovery on both platforms, independent preloads, route reuse, and preserved Account state. The Maestro navigation flow checks Account → Register → Account → Forgot Password → Account, including retained email input. Judge motion on a physical device with a preview/release build; these Node tests and JavaScript exports do not measure frame rate.

Validation starts after a field has received focus and then blurred, or after submit. Untouched fields show no errors on the initial render; the shared input wrapper ignores native initial unfocused notifications. Fields with errors revalidate as they are corrected. Errors appear below their field and the first invalid input receives focus. Email addresses are trimmed and lowercased. Passwords retain their original whitespace. Login requires a nonempty password; registration requires 8–128 characters and a matching confirmation. Names support international characters and require 1–80 characters after trimming.

## Checks and UI selectors

```sh
npm run test:validation
npm run test:e2e:auth
```

The schema tests run with Node 22.18+ (native TypeScript stripping). UI flows require Maestro and an installed development build connected to Metro; see [native-ui-tests.md](native-ui-tests.md).

Registration and password reset retain a `returnTo` route parameter when opened from the Account tab. Their login links return to that tab; direct form links return to `/login`. Only `account` is accepted as an alternate destination.

IDs use `auth-login`, `auth-register`, or `auth-forgot-password` as the prefix. Inputs append `-email`, `-password`, `-name`, or `-confirm-password`; field errors append `-error`, password visibility buttons append `-visibility`, and submit feedback uses `-submit-status`. Navigation buttons use `auth-login-register`, `auth-login-forgot-password`, `auth-register-login`, and `auth-forgot-password-login`. The Account tab uses `tab-account`.

Schema tests cover normalization, required fields, malformed email, password length, international names, and confirmation errors. Maestro flows cover invalid submissions, corrections, and navigation. Native accessibility, keyboard layout, and visibility need device verification.
