# Component previews

The application component browser is `/ui`, with individual examples under
`/ui-component/[name]`. The Bottom Sheet page includes the retained local OTP demo;
the Buttons page includes a counted floating action. Demo data stays in showcase
code and does not replace production auth requests.

The Storybook route and default Metro integration have been removed. Storybook
packages, scripts and `.rnstorybook/` fixtures remain installed for maintenance.
The existing start script starts Metro; it does not expose an application route.
Do not reintroduce Storybook into production imports.

Update native stories for shared UI changes and run `npm run storybook:generate`.
Launch Screen has Ready, Waiting and ReducedMotion fixtures. Floating Action has
Interactive, Disabled and ReducedMotion fixtures. Typechecking includes stories,
but fixture registration does not prove native behavior.

Launch and auth fixtures use the configured build's name, artwork and heading
font. The launch Replay control retains a stable selector. To inspect the other
brand, restart Metro with its selectors and use a matching native build; these
fixtures do not provide runtime tenant switching. Both brands' font rendering,
Arabic fallback and artwork need native verification. See [bundled assets](assets.md).

`/ui-component/text` now has local UX/Instagram and appearance controls, samples
on three page surfaces, explicit text-color overrides and a counted primary
button. The retained `Components/Text/ThemeComparison` story uses that same
composition. Its provider stays in memory; app appearance persistence belongs
only to the root. Check that scheme/palette changes retain the action count and
that returning to Settings leaves the configured palette and saved appearance
intact. See [appearance verification](appearance-themes.md).

The Buttons page's standalone section and retained `Components/Button/StandaloneHostLight`
and `StandaloneHostDark` compositions share the same preview implementation.
They compare forced light/dark appearance, inherited intrinsic width, diagonal
physical corners and disabled activation. Custom labels report their own Host's
scheme and direction. The retained fixtures add a local RTL toggle and counted
actions; check that direction changes preserve the count, edge taps count once
and disabled taps leave it unchanged. Native width, clipping, icon/text order and
touch behavior still require iOS/Android checks. Retained story registration does
not provide a running Storybook route.
