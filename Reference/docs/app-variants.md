# App variants

Foodiya has three native identities, so all three builds can be installed on the
same device:

| EAS profile | Display name | Android package / iOS bundle ID |
| --- | --- | --- |
| `development` | Foodiya (Dev) | `com.hyrkul.foodiya.dev` |
| `preview` | Foodiya (Preview) | `com.hyrkul.foodiya.preview` |
| `production` | Foodiya | `com.hyrkul.foodiya` |

Running `npm start`, `npm run android`, or `npm run ios` selects development by
default. When changing a locally generated native project to another variant,
set `APP_VARIANT` and run a clean prebuild first. In PowerShell:

```powershell
$env:APP_VARIANT = "preview"
npx expo prebuild --clean
npx expo run:android --variant release
Remove-Item Env:APP_VARIANT
```

In macOS or Linux shells:

```sh
APP_VARIANT=preview npx expo prebuild --clean
npx expo run:android --variant release
```

Use the matching EAS profile for cloud builds:

```sh
eas build --profile development
eas build --profile preview
eas build --profile production
```

The existing `development` profile remains an iOS Simulator build. For a
development build that can be installed on a physical iPhone, use:

```sh
eas build --profile development-device --platform ios
```

Build profiles, EAS environments, and update channels intentionally use the
same names. The `env` blocks in `eas.json` are sufficient for builds. Before
publishing EAS Updates, also create `APP_VARIANT` in each server-side EAS
environment because build-profile `env` values are not available to
`eas update`:

```sh
eas env:set --name APP_VARIANT --value development --environment development --visibility plaintext
eas env:set --name APP_VARIANT --value preview --environment preview --visibility plaintext
eas env:set --name APP_VARIANT --value production --environment production --visibility plaintext
```

Then publish updates with a matching channel and environment:

```sh
eas update --channel preview --environment preview
```

## Push notification service files

The existing `google-services.json` and `GoogleService-Info.plist` are registered
only for the production identity. Register the development and preview IDs as
separate Firebase apps, then put the downloaded files at these paths:

- `google-services.development.json`
- `GoogleService-Info.development.plist`
- `google-services.preview.json`
- `GoogleService-Info.preview.plist`

The dynamic config detects these files automatically. Until they exist, dev and
preview builds omit the production-only Firebase files; those builds remain
installable side by side, but remote push notification registration is not
expected to work.

If `APP_VARIANT` is absent or unrecognized, the config deliberately defaults to
development so a local command cannot accidentally generate the production
identity. `Constants.expoConfig?.extra?.appVariant` exposes the resolved variant
to application code.
