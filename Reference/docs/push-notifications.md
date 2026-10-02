# Push notification contract

Foodiya notification navigation uses a versioned, allowlisted intent. The app
does not navigate to arbitrary URLs supplied by a push payload.

## Supported payloads

```json
{
  "version": 1,
  "target": "recipe",
  "targetId": "recipe-uuid",
  "notificationId": "unique-notification-id"
}
```

Other targets:

```json
{ "version": 1, "target": "home", "notificationId": "..." }
{ "version": 1, "target": "category", "targetId": "category-uuid", "notificationId": "..." }
{ "version": 1, "target": "liked-favorites", "tab": "liked", "notificationId": "..." }
{
  "version": 1,
  "target": "search",
  "query": "tagine",
  "categoryUuid": "optional-category-uuid",
  "cuisineUuid": "optional-cuisine-uuid",
  "difficultyUuid": "optional-difficulty-uuid",
  "notificationId": "..."
}
```

`notificationId` should be unique and stable so repeated OS responses are
handled once per app session. Never include access tokens, private recipe data,
or other secrets in notification content.

## Registration

Call `requestPushNotificationToken()` only after a contextual user action that
explains why notifications are useful. It returns the native Firebase Cloud
Messaging token. Send that token to an authenticated backend endpoint and
associate it with the current user and device. Subscribe with
`subscribeToPushTokenRefresh()` and replace the stored token whenever Firebase
rotates it. Delete or disable that registration on logout and when FCM reports
that the token is no longer valid.

The repository intentionally does not upload tokens yet because no device-token
API contract exists in the current services layer.

FCM is enabled only when the selected app variant has both matching Firebase
configuration files. The current repository contains production files. Add
`google-services.development.json` and `GoogleService-Info.development.plist`
before requesting a token from a development build; preview uses the equivalent
`.preview` filenames.

## Native rebuild

Changes to the `expo-notifications` config plugin require a new development or
production build. Push notifications and deep links should be tested on real
Android and iOS devices, not only Expo Go.
