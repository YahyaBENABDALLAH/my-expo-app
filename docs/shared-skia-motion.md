# Shared page motion

Retained pages use opaque theme backgrounds and one shared header overlay. Its
native blur mask and visible artwork consume the same UI-thread geometry. Native
layout, touch shielding, safe areas and RTL remain in the shared page family.

Only Dunes, Ribbon and Rain remain; Dunes is the default. Aurora and the dedicated
Skia demo are removed. The launch screen retains Lottie and its Skia reveal edge.

Settings has a saved Reduce Motion switch. Custom motion uses the existing shared
activity subscription and effective app preference; frame loops pause while inactive.
The root config also aligns Reanimated and stack transitions with that choice.

Read the canonical [page contract](../.agents/skills/foodiya-ui-page/references/page-guide.md),
[launch contract](../.agents/skills/foodiya-ui-launch-screen/SKILL.md) and
[appearance contract](../.agents/skills/foodiya-ui-appearance/SKILL.md).
Native timing, blur, touch delivery and background/resume performance require
device testing; lint, typechecking and exports only verify static/build integration.
