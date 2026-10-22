# Home catalog layout

Home follows the supplied Epic Store reference with recipe placeholders:

- A hero rail with joined artwork, a tinted footer, metadata, and save/action buttons.
- Featured, Quick meals, and Chef picks rails, each with two columns of four compact rows.
- From our kitchen landscape cards with metadata and an action below the image.
- Cooking inspiration artwork cards.
- A full-width Free recipes section with a status ribbon and recipe information.
- A final vertical recipe catalog.

`home-screen.tsx` owns the page shell and the single vertical ScrollView.
`home-catalog-sections.tsx` owns section placement and horizontal ScrollViews.
`home-catalog.data.ts` supplies eight translated sample items with random
[Picsum](https://picsum.photos/) photos. Each Home mount creates a random seed;
each item uses its seeded 800×450 photo for artwork and thumbnails throughout
saves, previews, resizing and language changes. `expo-image` renders passive
content inside Expo UI `RNHostView`, with fixed geometry, cover cropping,
memory/disk caching and a neutral loading/error surface. Native controls and
text retain card interaction. Artwork-only buttons show their title below the photo.
`HomeCatalogCard` owns card presentation; existing Buttons and bottom navigation
are unchanged. Sample actions open a preview, and hero saves last for the current
mount. Home loads remote photos without requesting recipe API data. The page Host
owns safe-area padding directly; the existing shared navigation shell is retained.

The Details preview sheet stays mounted and toggles `isPresented`. Its selected
content is retained while closing. Home shares `min(420, screenHeight * 0.6)`
between the sheet's native content Column (`contentHeight`) and its ScrollView.
The native content height is available before presentation; it does not wait for
an RN/Host measurement bridge. The sheet keeps native width, chrome and
partial/expanded behavior, so this is not an outer 50% snap height.
Native flicker confirmation is checked separately from the Maestro interaction flow.

The existing theme and English, French, and Arabic translations are respected.
`Recipes/Home catalog` has native light/dark stories using bundled images to stay
independent of network access. The selected preview stores
its item ID so an open sheet follows live translations without losing selection.
Compact actions use the existing Button's intrinsic width so translated labels
fit without forcing a line break.

## Testing before the Picsum change

- `npm run test:recipes`: 35 passed, including five new Home catalog checks. The
  obsolete live-query Home cases were replaced by the placeholder catalog contract;
  reusable skeleton and showcase lifecycle checks remain.
- `npm run test:layout`: 176 passed, including two first-frame sheet width checks.
- `npm run test:localization`: 7 passed.
- `npm run test:architecture`: 14 passed.
- Lint, typecheck and formatting pass.

The Node fixtures run production components and hooks with native view boundaries
mocked. They verify state, layout inputs and callbacks; they cannot establish native
rendering, touch behavior, gestures or absence of flicker.

The former native flow opened/closed Details three times, dismissed with Android
back, selected a different recipe after swiping the hero rail, and opened the last
item after scrolling the page vertically. Automated suites have been removed;
selectors remain independent of translated wording for future tests.
The horizontal gesture begins at the hero Save control so it follows the card's
native geometry on each phone and avoids the floating developer controls.

Android passed on 2026-10-13 using Maestro 2.11.0 and `emulator-5554`, with SDK 57
development build `ede528a9-b1bc-46b3-9b5b-58748c5cccef` connected to current Metro
source. The final flow completed in 2m 6s with zero failures. The ignored JUnit
report is `.expo/home-catalog-maestro-final-pass/report.xml`. The run exercised
the French UI; native inspection also confirmed that compact Details labels fit
on one line. Device setup completed Expo's first-run menu and disabled its
floating Tools button, which otherwise intercepted onboarding Skip.

The physical Android 13 phone (model `21091116AG`) passed the same Home flow on
2026-10-13 in 1m 47s, with zero failures. It used the installed development build
and current Metro source. The ignored report is
`.expo/home-catalog-maestro-phone-pass/report.xml`. This run covered repeated
Details presentation, closing, Android Back, horizontal rail selection and the
last catalog item after vertical scrolling.

Those runs did not verify iOS execution or compare animation frames. Maestro
checks visible state and interaction results, not animation frames.

## Picsum change verification (2026-10-13)

- Typecheck and lint for the changed source files pass.
- All 35 recipe checks pass, including eight distinct Picsum URLs, artwork/thumbnail
  source sharing and photo stability during save toggling.
- Storybook registration was regenerated; its Home fixtures use bundled photos.
- Project-wide lint reports two unrelated `react-hooks/set-state-in-effect` errors
  in `otp-bottom-sheet.tsx` and `otp-resend-button.tsx`.
- Android emulator `emulator-5554` displayed remote photos and matching thumbnails,
  new photos after a Home remount, and the saved state. Direct ADB interaction and
  UI hierarchy checks confirmed Details opens the selected recipe and closes back
  to Home. The final inspected screenshot is `.expo/picsum-home-verified.png`.
- The full native Maestro flow was interrupted twice when another process
  uninstalled `dev.mobile.maestro` during execution, as recorded in device logs.
  These attempts do not establish an automated native regression pass. Reports
  are `.expo/picsum-home-native/report.xml` and
  `.expo/picsum-home-native-retry/report.xml`. iOS remains unverified.

## Details sheet stability (2026-10-19)

- The merged implementation supplies the known content height to a native Column
  before presentation. The sheet and ScrollView share the same height, and the
  selected recipe remains mounted during dismissal.
- `npm run check` passes: typecheck, lint, formatting and all 519 Node checks.
- The complete Home Maestro flow passes on the physical Android 13 phone
  (`21091116AG`) against the merged source:
  repeated opening/closing, Android Back, a different hero recipe after swiping,
  and the final catalog recipe after vertical scrolling. The ignored run log is
  `.expo/home-sheet-merged-native.log`.
- A screen recording on that phone captured two Details openings. Frame
  inspection showed the same resting height on both,
  without the reported large downward jump and return. A small settling movement
  of roughly 20 physical pixels remained near the end of the opening animation.
  The ignored recording is `.expo/home-sheet-after.mp4`; the frame-position trace
  is `.expo/home-sheet-after-motion.json` (5-pixel spatial resolution, sampled at
  60 Hz from the recording). This is an observation of these two openings, not an
  automated guarantee for every device or frame rate.
- iOS animation remains unverified.
