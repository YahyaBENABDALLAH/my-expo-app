# Tests

Two suites:

- `components/` — buttons, text inputs, native control contracts, refresh and the Storybook frame/theme.
- `forms/` — validation, registration, password reset and OTP behavior.

Run `npm test` for both suites. To run one, use `npm run test:components` or
`npm run test:forms`. `helpers/` contains the shared source loader and JS renderer.

These tests check JavaScript behavior with native boundaries mocked. For real
typing, tapping and rendering, use `npm run test:e2e` with a connected development
build; see [native testing](../docs/native-ui-tests.md).
