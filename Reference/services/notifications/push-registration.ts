import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface PushRegistrationResult {
  status:
    | "granted"
    | "not-configured"
    | "not-device"
    | "permission-denied";
  token?: string;
}

function isFcmConfigured() {
  return Constants.expoConfig?.extra?.fcmEnabled === true;
}

async function loadFirebaseMessaging() {
  const [appModule, messagingModule] = await Promise.all([
    import("@react-native-firebase/app"),
    import("@react-native-firebase/messaging"),
  ]);

  return {
    messaging: messagingModule.getMessaging(appModule.getApp()),
    getToken: messagingModule.getToken,
    onTokenRefresh: messagingModule.onTokenRefresh,
  };
}

export async function requestPushNotificationToken(): Promise<PushRegistrationResult> {
  if (!Device.isDevice) {
    return { status: "not-device" };
  }

  if (!isFcmConfigured()) {
    return { status: "not-configured" };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      importance: Notifications.AndroidImportance.DEFAULT,
      name: "General",
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  const permissions =
    currentPermissions.status === Notifications.PermissionStatus.GRANTED
      ? currentPermissions
      : await Notifications.requestPermissionsAsync();

  if (permissions.status !== Notifications.PermissionStatus.GRANTED) {
    return { status: "permission-denied" };
  }

  const { messaging, getToken } = await loadFirebaseMessaging();
  const token = await getToken(messaging);
  return { status: "granted", token };
}

export async function subscribeToPushTokenRefresh(
  listener: (token: string) => void,
) {
  if (!isFcmConfigured() || Platform.OS === "web") {
    return () => {};
  }

  const { messaging, onTokenRefresh } = await loadFirebaseMessaging();
  return onTokenRefresh(messaging, listener);
}
