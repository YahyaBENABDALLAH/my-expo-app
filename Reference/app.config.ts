/// <reference types="node" />

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "development" | "preview" | "production";

const APP_ID = "com.hyrkul.foodiya";

const VARIANTS: Record<
  AppVariant,
  {
    id: string;
    nameSuffix: string;
    googleServices: { android: string; ios: string };
  }
> = {
  development: {
    id: `${APP_ID}.dev`,
    nameSuffix: " (Dev)",
    googleServices: {
      android: "./google-services.development.json",
      ios: "./GoogleService-Info.development.plist",
    },
  },
  preview: {
    id: `${APP_ID}.preview`,
    nameSuffix: " (Preview)",
    googleServices: {
      android: "./google-services.preview.json",
      ios: "./GoogleService-Info.preview.plist",
    },
  },
  production: {
    id: APP_ID,
    nameSuffix: "",
    googleServices: {
      android: "./google-services.json",
      ios: "./GoogleService-Info.plist",
    },
  },
};

function getVariant(): AppVariant {
  switch (process.env.APP_VARIANT) {
    case "preview":
    case "production":
      return process.env.APP_VARIANT;
    default:
      return "development";
  }
}

function getGoogleServicesFile(path: string) {
  return existsSync(resolve(process.cwd(), path)) ? path : undefined;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = getVariant();
  const variantConfig = VARIANTS[variant];
  const androidGoogleServicesFile = getGoogleServicesFile(
    variantConfig.googleServices.android,
  );
  const iosGoogleServicesFile = getGoogleServicesFile(
    variantConfig.googleServices.ios,
  );
  const iosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME?.trim();
  const googleWebClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const hasFirebaseConfiguration = Boolean(
    androidGoogleServicesFile && iosGoogleServicesFile,
  );
  const hasManualConfiguration = Boolean(
    iosUrlScheme && googleWebClientId,
  );
  const googleSignInPlugin: NonNullable<ExpoConfig["plugins"]>[number] | null =
    hasFirebaseConfiguration
    ? "react-native-nitro-google-signin"
    : iosUrlScheme && googleWebClientId
      ? ["react-native-nitro-google-signin", { iosUrlScheme }]
      : null;
  const plugins: NonNullable<ExpoConfig["plugins"]> = [
    ...(config.plugins ?? []),
  ];
  if (hasFirebaseConfiguration) {
    plugins.push(
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
    );
  }
  if (googleSignInPlugin) plugins.push(googleSignInPlugin);
  plugins.push([
    "expo-dev-client",
    { addGeneratedScheme: variant === "development" },
  ]);

  return {
    ...config,
    name: `${config.name ?? "Foodiya"}${variantConfig.nameSuffix}`,
    slug: config.slug ?? "foodiya",
    ios: {
      ...config.ios,
      bundleIdentifier: variantConfig.id,
      googleServicesFile: iosGoogleServicesFile,
      entitlements: {
        ...config.ios?.entitlements,
        ...(hasFirebaseConfiguration
          ? {
              "aps-environment":
                variant === "development" ? "development" : "production",
            }
          : null),
      },
      infoPlist: {
        ...config.ios?.infoPlist,
        ...(hasFirebaseConfiguration
          ? {
              UIBackgroundModes: Array.from(
                new Set([
                  ...(Array.isArray(
                    config.ios?.infoPlist?.UIBackgroundModes,
                  )
                    ? config.ios.infoPlist.UIBackgroundModes.filter(
                        (mode): mode is string => typeof mode === "string",
                      )
                    : []),
                  "remote-notification",
                ]),
              ),
            }
          : null),
      },
    },
    android: {
      ...config.android,
      package: variantConfig.id,
      googleServicesFile: androidGoogleServicesFile,
    },
    plugins,
    extra: {
      ...config.extra,
      appVariant: variant,
      googleSignInEnabled:
        hasFirebaseConfiguration || hasManualConfiguration,
      fcmEnabled: hasFirebaseConfiguration,
    },
  };
};
