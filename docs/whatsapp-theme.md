# WhatsApp light and dark theme

`src/constants/themes/whatsapp.ts` is the WhatsApp semantic color source for application
screens, authentication, navigation, fields, loading, feedback and native stories.
The palette is inspired by WhatsApp's green and teal identity, neutral surfaces
and mint containers. These are project tokens, rather than a claim to reproduce
every platform/version of WhatsApp exactly. See [page footers and all four themes](appearance-themes.md) for the theme picker and other palettes.

| Role                    | Light     | Dark      |
| ----------------------- | --------- | --------- |
| Primary                 | `#25D366` | `#25D366` |
| On primary              | `#111B21` | `#111B21` |
| Primary container       | `#D9FDD3` | `#005C4B` |
| Secondary               | `#075E54` | `#00A884` |
| Secondary container     | `#E7FCE3` | `#103B32` |
| Interactive text / tint | `#008069` | `#25D366` |
| Background              | `#FFFFFF` | `#0B141A` |
| Surface                 | `#F0F2F5` | `#111B21` |
| Raised surface / header | `#FFFFFF` | `#202C33` |
| Main text               | `#111B21` | `#E9EDEF` |
| Supporting text         | `#54656F` | `#8696A0` |
| Border                  | `#D1D7DB` | `#3B4A54` |
| Error                   | `#B3261E` | `#F15C6D` |
| Success                 | `#008069` | `#25D366` |
| Warning                 | `#8A5A00` | `#E9B94A` |
| Information             | `#007B9F` | `#53BDEB` |

Additional roles cover pressed primary, foregrounds for filled feedback actions,
surface variants, dividers, selection, overlays, shadows, status containers and
navigation glass. Navigation aliases are derived from these same semantic roles.
Floating actions use the selected theme gradient for every context; their icons and
accessibility labels identify the action. Skia theme effects consume the same
colors, including the light/dark launch overlay. Flame colors remain illustration
colors, independent of the interface palette.

The app initially follows device appearance; the controls at the bottom of each page can select light/dark and a brand for the current session. A `UniversalHost` or component can force a
scheme for deterministic native stories. `authColors` aliases the WhatsApp defaults;
the existing auth button exports remain compatible. Expo Router's theme maps
header, text, background, border, accent and notification colors explicitly.

## Native control mapping

- Primary buttons use `primary` / `onPrimary`; secondary buttons use the native
  outlined/bordered style with `secondary`; links use `tint`.
- Success, warning and destructive fills use their own `onSuccess`, `onWarning`
  and `onError` label colors. Older explicit palettes can still use `tint` and
  optional `onAccent` as fallbacks.
- Field text, placeholder, surface, border, cursor, selection and selection
  handles consume the owning Host's scheme. Explicit field colors take priority.
- Switches use dedicated track, thumb, off border and disabled tokens derived
  from the shared palette. `Switch` from `@components/ui` maps them to Android's
  native color props. iOS uses `switchTrackOn` as native tint; SwiftUI controls
  its thumb, off track and disabled appearance. Both inherit the owning Host.
- Android Hosts derive a Material palette from `tint`; SwiftUI Hosts apply native
  tint. Controls without explicit color props keep their native generated colors,
  geometry, disabled treatment and interaction feedback.
- Native splash light/dark backgrounds and the adaptive icon background are
  configured in `app.json`. These native configuration changes require a new
  binary; JavaScript reloads apply the runtime theme changes.

## Review and verification

Native Storybook includes `Expo UI/Theme Tokens` → `Light` and `Dark`. Each displays
all color roles, button variants, switches, a disabled button and a field. Existing control
stories also consume the production tokens.

The layout suite checks Host scheme inheritance, field and selection mapping,
refresh controls, button foregrounds and intents on both native adapters. These
are JavaScript contract checks. Device rendering, native disabled colors,
selection behavior and the release splash still need iOS and Android inspection.

Design reference: [WhatsApp's design update](https://www.meta.com/design-at-meta/blog/whatsapp-user-interface-update/).
Native API reference: [Expo SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/).
