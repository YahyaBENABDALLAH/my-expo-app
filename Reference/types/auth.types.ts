/** Foodiya.Identity JSON DTOs. Preserve backend names, fields and nullability. */
export type DeviceMetadata = {
  /** @minLength 8 @maxLength 200 */
  deviceInstallationId: string;
  platform?: "ios" | "android" | "web" | "windows" | string;
  deviceName?: string;
  osVersion?: string;
  appVersion?: string;
};

export type LoginRequest = {
  /** @minLength 3 @maxLength 256 Email or username. */
  login: string;
  /** @minLength 8 @maxLength 128 */
  password: string;
} & DeviceMetadata;

export type TokenResponse = {
  /** @format uuid */
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  /** @format date-time */
  accessTokenExpiresAtUtc: string;
  /** @format date-time */
  refreshTokenExpiresAtUtc: string;
  /** @format uuid */
  sessionId: string;
  /** @format uuid */
  deviceId: string;
};

export type AuthFlowResponse = {
  isOtpValidated: boolean;
  /** @format uuid */
  challengeId: string | null;
  maskedEmail: string | null;
  /** @format date-time */
  otpExpiresAtUtc: string | null;
  /** @format date-time */
  otpResendAvailableAtUtc: string | null;
  loginResponse: TokenResponse | null;
};

export type ConfirmRegistrationRequest = {
  /** @format uuid */
  challengeId: string;
  /** Six-digit email verification code. */
  code: string;
} & DeviceMetadata;

export type RegisterRequest = {
  /**
   * @minLength 3
   * @maxLength 50
   */
  userName: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  firstName: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  lastName: string;
  /**
   * @format email
   * @minLength 0
   * @maxLength 256
   */
  email: string;
  /**
   * @minLength 8
   * @maxLength 128
   */
  password: string;
  /** Defaults to "en" on the server. */
  preferredLanguage?: string;
};

export type GoogleSignInRequest = {
  /** Google OpenID Connect ID token. */
  idToken: string;
} & DeviceMetadata;

export type ResetPasswordRequest = {
  challengeId: string;
  /** Exactly six digits. */
  code: string;
  /** @minLength 8 @maxLength 128 */
  newPassword: string;
};

export type ChallengeResponse = {
  challengeId: string;
  expiresAtUtc: string;
};

export type CurrentIdentityResponse = {
  userId: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  accountStatus: string;
  roles: string[];
  sessionId: string;
  sessionCreatedAtUtc: string;
  sessionExpiresAtUtc: string;
  deviceId: string;
  platform: string | null;
  deviceName: string | null;
  osVersion: string | null;
  appVersion: string | null;
};

export type DeviceResponse = {
  id: string;
  platform: string | null;
  deviceName: string | null;
  firstSeenAtUtc: string;
  lastSeenAtUtc: string;
  verifiedAtUtc: string | null;
  revokedAtUtc: string | null;
  isCurrent: boolean;
  hasPushRegistration: boolean;
};

export type DeviceListResponse = {
  items: DeviceResponse[];
  skip: number;
  take: number;
};

export type SessionResponse = {
  id: string;
  deviceId: string;
  createdAtUtc: string;
  expiresAtUtc: string;
  revokedAtUtc: string | null;
  isActive: boolean;
  isCurrent: boolean;
};

export type SessionListResponse = {
  items: SessionResponse[];
  skip: number;
  take: number;
};
