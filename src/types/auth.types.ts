import type { z } from 'zod';
import type {
  tokenResponseSchema,
  authFlowResponseSchema,
  currentIdentityResponseSchema,
} from '@/validation/schemas/api/auth';
/** Foodiya.Identity JSON DTOs. Preserve backend names, fields and nullability. */
export type DeviceMetadata = {
  /** @minLength 8 @maxLength 200 */
  deviceInstallationId: string;
  platform?: 'ios' | 'android' | 'web' | 'windows' | string;
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

export type TokenResponse = z.infer<typeof tokenResponseSchema>;

export type AuthFlowResponse = z.infer<typeof authFlowResponseSchema>;

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

export type CurrentIdentityResponse = z.infer<typeof currentIdentityResponseSchema>;

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
