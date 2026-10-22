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
