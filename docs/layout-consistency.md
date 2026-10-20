# Shared screen geometry

Screen containers add no decorative padding. They retain device safe areas,
keyboard avoidance and measured header clearance. Each content section or
element owns its padding through `PageSection` or the shared geometry tokens in
`src/constants/layout.ts`.

| Role                          | Value                                 |
| ----------------------------- | ------------------------------------- |
| Section padding               | 16 on each edge                       |
| Default gap within a section  | 16                                    |
| Compact content gaps          | 4, 8 or 12                            |
| Larger content gaps           | 24 or 32                              |
| Header padding                | 16 horizontal, 8 vertical             |
| App-owned card corners        | 16 on every corner                    |
| Field and inset-image corners | 12 on every corner                    |
| Badge corners                 | 8; circular badges use the pill token |

`PageSection` accepts `children`, `spacing`, `alignment`, `style`, `testID` and
`inset`. `inset={false}` removes horizontal padding for full-width sections;
their text and horizontal rails apply the same 16-point gutters themselves.
There is no extra Host, color lookup or measurement state in a section.

`PageFrame`, navigation scenes, auth, loading and recovery use the selected
theme's `background`. Headers retain the shared theme-aware wave/blur treatment
and accessible solid-background fallback. Card surfaces, tinted sections, maps
and canvas artwork keep their own semantic or specialized presentation.

The route audit covers Home, Search, Create Recipe, recipe collections and
details, category and ingredient browsing, More, Settings, auth/account,
onboarding, developer tools, component showcases, maps, canvas and not-found.
Aliases redirect to those screens. Storybook remains a developer surface with
its existing native frame.

Native controls and grouped `FieldGroup` sections retain platform-owned shape,
row colors and intrinsic insets. Registration and Settings share the transparent
form canvas, with their page theme visible behind native groups. Device cutouts
can make physical safe-area edges unequal; section padding remains symmetric
inside the available safe viewport.

`Components/Page Section/Interaction` previews inset and full-width sections,
text input, recipe cards, action counts and local save state using bundled
images. Controls select light/dark appearance and the existing brand theme.
`Components/Page Header` also uses the production section geometry.
These stories support native inspection; they are not screenshot regressions.

Run `npm run lint`, `npm run typecheck`, and `npm test`. At this pass, no Android
device/emulator was connected, and iOS native verification was unavailable on
the Windows host. Visual alignment, large text, RTL, keyboard and native hit
areas still require device verification.
