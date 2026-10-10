# Inventory page tests

Run the executable Node suite with `npm test`. It includes 20 route/navigation tests, 14 auth validation tests (seven for password reset), and 19 existing auth service/session tests. No accounts or external services are needed.

The navigation tests discover the actual route files for both platform configurations and exercise the installed Expo URL parser. They check detail IDs, decoded search/filter parameters, saved-tab selection, recovery challenge parameters, unknown-page fallback, auth stack return, and route availability changes. To run the parser in Node, the native import barrel is replaced with Expo's pure path-config validator; native views and protected layout rendering are not exercised by this suite.

Password-reset tests use the production schema and challenge validator. They check missing/repeated/malformed challenge values, UUID letter case, six ASCII digits, OTP whitespace and leading zeroes, password whitespace, length boundaries, and confirmation errors.

## Native flows

With a signed-in test session in the installed development app, run:

```sh
npm run test:e2e:pages
```

The three page flows cover five tabs, saved-tab switching, history/creations links, Back, More tools, direct recipe/category entry, malformed IDs, search filters, `/main` redirection, and not-found recovery. They preserve session data and never log in, log out, submit recipes, or use real recipe IDs. Device Info's content comes from the device. UI showcase and Storybook have separate existing stories/flows.

While signed out, run:

```sh
npm run test:e2e:auth
```

The new reset flow checks missing recovery context, valid recovery form visibility, empty-submit validation, and returning to Login. It never submits valid recovery values. The new guard flow checks that product deep links stay behind Login. These flows intentionally require a different session state from the page flows; run them separately. The default `.maestro/config.yaml` continues to discover auth and Storybook flows; page flows use their own configuration.

Use the existing Metro/development-client bootstrap from [native-ui-tests.md](native-ui-tests.md). Android USB devices need `adb reverse tcp:8081 tcp:8081`. Override `DEV_CLIENT_URL` for a Wi-Fi device. Select a device with `maestro --device <id> test .maestro/pages`. These checks target native SwiftUI/Compose controls and use readiness conditions rather than sleeps.

Selectors added: `page-title`, `page-back`, `page-action-<lowercase-label-with-hyphens>`, `tab-home`, `tab-search`, `tab-create`, `tab-recipes`, `tab-more`, and the `auth-reset-password-*` field/action IDs. Verify these appear in each platform's accessibility hierarchy on the first device run.

## Limits

No Android device was connected when this suite was created, and iOS native execution was unavailable on this Windows host. Node tests, lint, and typecheck can run here; the Maestro flows still need device execution. YAML parsing confirms syntax only. These tests do not establish push handling, cold-start return after login, real product queries, form saves, or API recovery success: those features need their own tests when implemented. Current page flows open links after the development client is connected to Metro; they are not OS cold-start tests.

Main destinations now use platform Expo UI segmented controls (SwiftUI segmented Picker on iOS, Material single-choice segmented buttons on Android). Expo Router still owns navigation and the selected segment follows the active route. The existing tab-* selectors are retained; native selector exposure, selection feedback, small-screen fit, and accessibility require device execution. Interactive light/dark Storybook examples are under Pages/Segmented navigation.

## Reference tab screens and motion

Run `npm run test:recipes` for storage concurrency/isolation checks. `npm test` includes recipe payload validation, collections, API cancellation, and chef-metadata lifecycle checks. Native context actions are covered by `.maestro/pages/context-actions.yaml`, with signed-in state required. The Create flow checks validation without publishing a recipe. Interactive artwork examples are in Pages/Reference motion.

Home, Search, and supporting detail/browse pages use actual API queries. Native tests therefore need a reachable API plus appropriate fixture data for content assertions; title/navigation/error-state checks do not prove backend writes. Favorites/history are local and scoped to the signed-in account. Source inspection, typecheck, tests, and native bundle export cannot prove visual parity, performance, or accessibility. See `reference-tabs-report.md` for the current implementation and limits.

Pull-to-refresh uses Pages/Navigation shell's `PullToRefresh` and `PullToRefreshLongContent` stories with deterministic deferred completion/failure. Run `maestro test .maestro/storybook/pull-to-refresh.yaml` on each native platform to check the gesture, duplicate suppression, completion, saved content after errors and retry recovery. The story needs no API or login. `npm run test:services` separately verifies exact-query scoping, preserved filters/page, disabled reads, pending request reuse and offline behavior. The gesture flow remains unexecuted until a native device is connected; YAML parsing and Node tests do not verify native interaction.
