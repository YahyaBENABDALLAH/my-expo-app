import { z } from 'zod';

const identifier = z.string().trim().min(1);
const timestamp = z.iso.datetime({ offset: true });

export const tokenResponseSchema = z.object({
  userId: identifier,
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(z.string()),
  accessToken: z.string().trim().min(1),
  refreshToken: z.string().trim().min(1),
  tokenType: z.string().min(1),
  accessTokenExpiresAtUtc: timestamp,
  refreshTokenExpiresAtUtc: timestamp,
  sessionId: identifier,
  deviceId: identifier,
});

export const authFlowResponseSchema = z
  .object({
    isOtpValidated: z.boolean(),
    challengeId: identifier.nullable(),
    maskedEmail: z.string().nullable(),
    otpExpiresAtUtc: timestamp.nullable(),
    otpResendAvailableAtUtc: timestamp.nullable(),
    loginResponse: tokenResponseSchema.nullable(),
  })
  .superRefine((flow, context) => {
    if (flow.isOtpValidated ? !flow.loginResponse : !flow.challengeId) {
      context.addIssue({
        code: 'custom',
        message: 'Missing authentication result.',
        path: [flow.isOtpValidated ? 'loginResponse' : 'challengeId'],
      });
    }
  });

export const currentIdentityResponseSchema = z.looseObject({
  userId: identifier,
  userName: z.string(),
  email: z.string(),
  emailConfirmed: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  preferredLanguage: z.string(),
  accountStatus: z.string(),
  roles: z.array(z.string()),
  sessionId: identifier,
  sessionCreatedAtUtc: timestamp,
  sessionExpiresAtUtc: timestamp,
  deviceId: identifier,
  platform: z.string().nullable(),
  deviceName: z.string().nullable(),
  osVersion: z.string().nullable(),
  appVersion: z.string().nullable(),
});

export const messageResponseSchema = z.looseObject({ message: z.string() });
