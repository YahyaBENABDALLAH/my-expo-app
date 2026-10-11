# Search field

`SearchField` is a standalone Expo UI control for `PageScreen.headerAccessory`.
The caller owns navigation and the query. Import it from `@components/ui`.

`mode="navigate"` exposes a native button with a search-field surface, icon and
placeholder. It navigates without opening a keyboard on Home. `mode="edit"`
uses the existing native text-input composition, an observable value, a search
return key and a 48-point clear action. Both use the same radius, inset, icon,
font and trailing action space. Native text can grow with accessibility sizing.

An `active` flag blurs the input when leaving the screen. A new `focusRequest`
focuses once, including when Search is already mounted; switching back from a
detail or changing the query never consumes the same request twice. The
300-ms spring settles a 4-point translation and 1.5% scale on the UI thread.
`animate={false}`, reduced motion, backgrounding and inactive screens cancel
custom motion. There are no layout measurements, repeated timers or dependencies.

The navigation button's platform adapters keep SwiftUI's plain button and
Compose's native clickable surface with zero extra content padding. They retain
native accessibility labels and feedback. Ordinary content uses universal
Row/Column. Theme roles: `surface`, `border`, `muted`, `text`, `tint`, `selection`.

Stories: `.rnstorybook/stories/pages/search-field.stories.tsx` exercises Home,
Search, typing, clearing, Cancel and returning with a draft in light, dark,
static and narrow-phone fixtures. Maestro flows: `.maestro/storybook/search-journey.yaml`
and `.maestro/pages/home-search.yaml`. JS checks establish focus-intent and
state contracts; native geometry, hit areas, keyboard and motion need device
verification on iOS and Android.
