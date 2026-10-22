---
name: foodiya-ui-bottom-sheet
description: Compose or maintain Foodiya native bottom sheets for details, actions, draft preferences and bounded scrolling. Use for the BottomSheet public props, controlled dismissal, Host ownership, content sizing, theme, direction and the in-app showcase. Use the OTP skill for verification workflows.
---

# Foodiya bottom sheets

Use `BottomSheet` from `@components/ui` for contextual details, short actions and
editable panels on iOS and Android. Keep feature state and submission with the
consumer. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Check the project contract first

Read the current [wrapper and props](../../../src/components/ui/bottom-sheet/bottom-sheet.tsx)
and the affected consumer. The wrapper intentionally exposes less than Expo's
universal component; this skill does not add props. UI implementations import
concrete sibling files; feature screens use the public barrel.

| Prop            | Contract                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `children`      | Optional native content. Arrange siblings in a `Column` or `Row`.                                                 |
| `isPresented`   | Required controlled boolean owned by the caller.                                                                  |
| `onDismiss`     | Required `() => void`; synchronize caller state when native dismissal occurs.                                     |
| `testID`        | Optional stable, language-independent native selector.                                                            |
| `contentHeight` | Optional finite positive height for the wrapper's full-width native content `Column`. Omit for intrinsic content. |

The wrapper has no `style`, `snapPoints`, `contentPadding`, `showDragIndicator`,
`colorScheme`, `modifiers`, backdrop options, imperative ref or pending state.
Do not pass upstream props or invent Gorhom-style `index`, `snapToIndex`,
`onChange` or `isOpen`. If a requested behavior needs a new prop, extend the
shared contract deliberately and check both native implementations and consumers.
Do not replace this adapter with a community sheet library.

Before changing Expo or React Native usage, read installed versions and follow
`AGENTS.md`'s documentation lookup. This guide was checked with Expo SDK 57 and
`@expo/ui` 57.0.21. Relevant upstream references:

- [SDK 57 BottomSheet](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/bottomsheet/)
- [SDK 57 ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/)
- [Installed native adapters](../../../node_modules/@expo/ui/src/universal/BottomSheet/)

## Own presentation and draft state

- Open by setting `isPresented` to `true`. Close from an explicit action by setting
  it to `false`; `onDismiss` must also set it to `false` for native gestures,
  backdrop dismissal and Android Back. Reuse an idempotent close operation.
- Keep the presenter mounted while toggling visibility. Do not conditionally
  remove it on close or clear selected content before the closing transition can
  finish. Do not treat `onDismiss` as an animation-completed callback: the native
  adapters notify differently, and programmatic closing must work independently.
- For several sheet examples, use one active-sheet discriminator. If delayed
  native callbacks can overlap, clear only the matching presentation. Do not
  present a second native modal while the first is dismissing.
- Initialize an editable draft from committed values on opening. Apply commits
  explicitly; Cancel, swipe, backdrop and Back discard the uncommitted changes.
  Dismissal alone must not submit, delete or navigate as if submission succeeded.
- Keep async work in the existing feature workflow. Disable unavailable actions
  and preserve duplicate-submit and stale-result guards across dismissal/reopen.
  This sheet supplies neither async coordination nor dismissal locking. If a
  workflow needs guaranteed non-dismissal, address the public/native contract.

## Compose content at the right boundary

Expo's native sheet creates an internal Host. Inside its content, use native
`Column`, `Row`, `UniversalTextContent` and `UniversalButtonContent`; give every
button an explicit semantic `variant`. Do not insert standalone hosted controls
or another Host merely to arrange native siblings. See the
[button](../foodiya-ui-button/SKILL.md) and [Host](../foodiya-ui-host/SKILL.md) skills.

`PageScreen` already supplies the surrounding project Host/context. At a React
Native boundary, use the existing `UniversalHost` pattern for inherited project
theme/direction; the native presenter still owns its separate Host. An actual RN
subtree needs `RNHostView`, and native controls re-entering from that subtree need
their own Host. Avoid RN views, strings or RN scroll controls directly in the
native content tree. Read the [RNHostView skill](../foodiya-ui-rn-host-view/SKILL.md)
when that bridge is necessary.

For form validation and keyboard handling, use existing form adapters and the
owning workflow. For code entry, resend cooldown, focus and verification, reuse
[OtpBottomSheet](../foodiya-ui-otp-bottom-sheet/SKILL.md). Its specialized width
measurement is not a generic bottom-sheet requirement.

## Choose intrinsic or bounded content

- **Short details/actions:** omit `contentHeight` and let native content determine
  the sheet size. Use `nativeFillWidth` when content/buttons need the available
  width. Do not use `flex: 1`, a full-screen spacer or measurement state to force
  an intrinsic sheet to grow.
- **Long content, forms or large text:** use a native `ScrollView` with a known
  viewport. Supply the same positive height to `contentHeight` and the inner
  scroll view, for example `Math.min(420, windowHeight * 0.6)`. Compute it before
  presentation and respond to window changes. This avoids waiting for an RN/Host
  measurement round trip. Keep the scroll content itself intrinsic.
- `contentHeight` bounds content, not the outer sheet height or a snap point.
  Native padding, safe areas and Android's partial/expanded states remain
  platform-owned. Do not promise exact 50% detents or identical outer geometry.
- Expo owns corners, drag chrome and default sheet padding. Add only purposeful
  content spacing with shared tokens; do not copy page-header clearance or the
  page's safe-area padding into a modal. Put a close/apply action where it remains
  reachable with large text, a short window and the keyboard.
- Native `ScrollView` renders all children. Keep these panels bounded in scope;
  reuse an existing suitable screen/list for an unbounded feed.

Read [composition examples](references/composition.md) when adding a short sheet
or a scrolling viewport. The [in-app showcase](../../../src/features/ui-showcase/bottom-sheet-screen.tsx)
also demonstrates transactional preferences without network or storage effects.

## Preserve appearance and accessibility

The wrapper resolves `surface` for the native container/chrome and `text` for
Android's default content color through `useHostColorScheme`. Project content
controls resolve their semantic tokens through the existing React context. The
iOS drag indicator is hidden; Android keeps its native default. A hidden handle
does not disable swipe dismissal.

Native appearance follows the app mode synchronized in the root layout through
React Native `Appearance`. There is no generic sheet-width context or dedicated
theme/direction bridge in this wrapper. Do not assume an isolated Host override
rethemes the entire native presentation or that open-sheet RTL is proved by
React context alone. Check the actual sheet when modifying these boundaries.

Translate visible labels in English, French and Arabic. Use logical alignment,
wrapping text, named actions and a visible Close/Cancel control; do not rely only
on gestures or an unlabeled icon. Keep controls usable with VoiceOver/TalkBack,
large text and reduced motion, retaining native presentation and focus behavior.

## Showcase and verification

Open **UI showcase → Bottom sheet**, route `/ui-component/bottom-sheet`. The
[catalog](../../../src/features/ui-showcase/catalog.ts) and
[screen registry](../../../src/features/ui-showcase/component-screen.tsx) own discovery.
Use this in-app page for the requested examples; tests and Storybook are not
required for this showcase task.

On available iOS and Android devices, check opening, explicit closing, native
dismissal and reopening; on Android also check Back and backdrop taps. In the
preferences example, Apply updates page values, Cancel/dismiss leaves them
unchanged, and reopening starts from committed values. Scroll the guide to its
final action. Repeat with light/dark modes, Arabic/RTL, large text and a short or
rotated window; include keyboard/focus checks when fields are involved.

Run `npm run typecheck` and `npm run lint`, format edited files, and validate
skill metadata/local links when editing guidance. Report native checks separately:
static checks and showcase registration do not establish native behavior.
