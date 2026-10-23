# Shared page motion

Retained pages use opaque theme backgrounds and one shared header overlay. Its
native blur mask and visible artwork consume the same UI-thread geometry. Native
layout, touch shielding, safe areas and RTL remain in the shared page family.

Dunes, Ribbon and Rain remain animated; both brand manifests still select Dunes
initially. Settings adds Default, the rectangular native header. Its wave
instance unmounts while navigation and drafts keep their React position. Native
blur, measured clearance, touch shielding and back actions remain in the page
family. Selecting an animated style again creates a fresh wave phase; pausing or
hiding an existing animated style preserves its phase.

Header geometry stays numeric in the common motion source. iOS serializes the
two SVG paths inside its animated material-mask props; Android consumes Skia paths
without SVG serialization. The launch edge keeps its cached paths and drift,
without evaluating deforming header contours or details. The neutral template's
minimal launch mounts no artwork or edge; Likan retains the branded Lottie/image
presentation and upward exit. No package or SVG support was removed.

Settings has a saved Reduce Motion switch. Custom motion uses the existing shared
activity subscription and effective app preference; frame loops pause while inactive.
The root config also aligns Reanimated and stack transitions with that choice.

Read the canonical [page contract](../.agents/skills/foodiya-ui-page/references/page-guide.md),
[launch contract](../.agents/skills/foodiya-ui-launch-screen/SKILL.md) and
[appearance contract](../.agents/skills/foodiya-ui-appearance/SKILL.md).
Native timing, blur, touch delivery and background/resume performance require
device testing; lint, typechecking and exports only verify static/build integration.
