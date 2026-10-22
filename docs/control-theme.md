# Native control themes

Buttons use semantic colors in every theme when both color props are omitted.
Primary, secondary, tertiary, link and status variants resolve their respective
theme tokens rather than all inheriting the Host's primary accent. Explicit
caller colors retain their existing override behavior. The native button stories
use these same defaults and provide light/dark comparisons of all nine variants.
Native geometry, disabled suppression and feedback remain platform-owned.

The original UX Template correction (2026-10-16) supplies a black primary with
white labels in both appearances. It fixed a native white fill with an unreadable
white label observed in the production Buttons page in dark mode.
At the user's request, the neutral UX foundations now pair with restrained red
danger, green success and amber warning accents, plus matching light/dark
containers. Only feedback accents are colored; primary remains black.
The corrected Buttons page was manually checked on iOS 27 / iPhone 18 Pro:
primary is black, feedback labels are readable, one press increments the action
counter once, and the disabled button leaves the counter unchanged. Android
adapter checks pass in JS; native Android visual verification remains pending.
The `WireframeLight` and `WireframeDark` native fixtures were also checked on
the same iPhone: upper/lower button-edge presses advanced the count to 1 then 2,
the disabled press kept 2, and reset returned it to 0. Both showed a black primary
surface and white label. These are manual checks; Maestro was not installed.

All universal Expo UI controls compose within the existing UniversalHost. It selects the shared light/dark scheme and uses the active theme’s tint as the native seed. Explicit seedColor overrides remain available. Native controls own their shape, padding, typography, disabled colors and interaction feedback rather than receiving a second painted surface.

| Component                                                     | Project behavior                                                                                  | Appearance / glass                                                                                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Switch / Checkbox                                             | Guard disabled callbacks; universal props and selectors                                           | Native Host colors; SwiftUI toggle glass feedback when supported                                                                                            |
| Slider                                                        | Guard disabled callbacks; Expo handles range, step and dragging                                   | Native Host colors; SwiftUI glass feedback when supported                                                                                                   |
| Picker                                                        | Disabled guard, typed items and fragments, Android observable selected label and native selectors | iOS menu trigger uses glass on iOS 26+, automatic on older iOS; native wheel; Android Material dropdown                                                     |
| SegmentedControl                                              | Common selection contract and option selectors                                                    | Native selected surfaces; SwiftUI system glass feedback when supported                                                                                      |
| Collapsible                                                   | Direct Expo UI export                                                                             | Native disclosure layout and animation; no dedicated glass style                                                                                            |
| FieldGroup                                                    | Direct universal Expo UI export with native sections and slots                                    | SwiftUI Form / Material grouping, form/row colors and scroll indicators                                                                                     |
| List                                                          | Coalesce pending refreshes and safely complete failures                                           | Native rows, scroll surface and refresh indicator                                                                                                           |
| ListItem                                                      | Forward slots and caller overrides; add missing Android native testID                             | Native headline/supporting/accessory colors and row surface                                                                                                 |
| Text                                                          | Shared text color and explicit semantic variants                                                  | Native typography when variant/font props are omitted; no calculated line height                                                                            |
| TextInput                                                     | Simple universal input composition with labels, validation feedback and icon actions              | Native typography/tint, shared text/surface/border/status roles, iOS plain secure/text fields and a stable minimum surface; no dedicated native glass style |
| Host / Column / Row / ScrollView / Spacer / Icon / RNHostView | Existing universal exports and necessary hosting boundaries                                       | Native layout and caller-supplied styles                                                                                                                    |

The previously simplified Button and BottomSheet remain in place. Button’s glass variant uses native iOS glass and an outlined Android button. BottomSheet keeps native presentation and a hidden iOS drag indicator. Glass styles require an iOS 26+ runtime and a build using Xcode 26+; Expo falls back to automatic styling otherwise. iOS native menus, sheets and controls receive system appearance where supported. This does not apply an artificial glass overlay to every container, text label, form or list.

TextInput retains its observable value/ref API, focus guards, password actions and RTL-aware icon slots. Native hosting now sizes the RN boundary without measurement state; both iOS modes use the same plain style and a 48-point minimum surface. Native typography/tint stay at their defaults unless explicitly overridden. These supply application behavior that a bare input does not provide. Form validation and async workflow state remain in features.

Color/shape/state code duplicated from Expo has been removed. Caller modifiers and Android ListItem color overrides remain available. No package or native project changes are needed.

Native Storybook light/dark, disabled, selection, disclosure, grouped-form and refresh fixtures reuse production exports. Native seedColor controls exercise Host seeds; picker Menu exercises native glass; text NativeDefault exercises native typography. Portable checks verify selection survives live scheme changes, disabled suppression, slots, selectors, refresh completion and Metro resolution. These mock native views and do not prove OS glass, visual geometry or hit areas. iOS/Android device inspection remains pending.

Context7 was consulted for Host theme propagation and native glass styles. Its results reference latest documentation, so APIs and fallbacks were cross-checked against SDK 57 pages and installed Expo UI 57.0.21 source.

References: [Expo SDK 57 universal UI](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/), [SwiftUI modifiers](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/), [Apple’s native Liquid Glass adoption](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass).

The text-input follow-up was manually checked in the iOS 27 iPhone 18 Pro simulator: empty/filled password toggles kept the same visible field height and retained the value. Its native Storybook height assertions are saved. The duplicate RNCSafeAreaProvider dependency was removed by the Storybook update; architecture checks now guard shared native module resolution. Android and full large-text native checks remain pending. See the [input guide](../.agents/skills/foodiya-ui-text-input/SKILL.md).
