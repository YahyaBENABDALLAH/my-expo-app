import {
  GoogleOneTapSignIn,
  GoogleSignInError,
  isCancelledResponse,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from "react-native-nitro-google-signin";
import Constants from "expo-constants";

let isConfigured = false;

export class GoogleSignInConfigurationError extends Error {
  constructor() {
    super("Google sign-in is not configured for this app build.");
    this.name = "GoogleSignInConfigurationError";
  }
}

function configure() {
  if (isConfigured) return;

  GoogleOneTapSignIn.configure({
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || "autoDetect",
    autoSelectOnSignIn: false,
  });
  isConfigured = true;
}

/** Opens Google's native credential flow and returns only the backend credential. */
export async function acquireGoogleIdToken(): Promise<string | null> {
  if (Constants.expoConfig?.extra?.googleSignInEnabled !== true) {
    throw new GoogleSignInConfigurationError();
  }

  configure();
  await GoogleOneTapSignIn.checkPlayServices();

  let response = await GoogleOneTapSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }

  if (isCancelledResponse(response)) return null;
  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new GoogleSignInError(
      statusCodes.DEVELOPER_ERROR,
      "Google did not return an ID token.",
    );
  }

  return response.data.idToken;
}

export function isGoogleCancellation(error: unknown) {
  return isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED;
}

export function isGoogleConfigurationError(error: unknown) {
  return error instanceof GoogleSignInConfigurationError ||
    (isErrorWithCode(error) && error.code === statusCodes.DEVELOPER_ERROR);
}

export function isGooglePlayServicesError(error: unknown) {
  return isErrorWithCode(error) &&
    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE;
}
