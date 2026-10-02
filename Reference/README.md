# Foodiya

Foodiya is a mobile recipe application for iOS and Android, built with Expo,
React Native, Expo Router, and TanStack Query.

## Requirements

- Node.js
- npm
- Xcode for iOS development
- Android Studio for Android development

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file with the API URL:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com
```

The optional telemetry client uses `EXPO_PUBLIC_TELEMETRY_API_URL` and falls
back to `EXPO_PUBLIC_API_URL`.

## Development

Start Metro:

```bash
npm start
```

Run a native development build:

```bash
npm run ios
npm run android
```

## Checks

```bash
npm run lint
npx tsc --noEmit
```

## Structure

- `app/`: Expo Router routes
- `features/`: screens and feature-specific UI
- `components/`: shared UI
- `services/`: API clients and data access
- `context/`: application providers
- `types/`: shared TypeScript types

See [Push notification contract](docs/push-notifications.md) for notification
payloads, direct-page routing, and device-token integration requirements.
