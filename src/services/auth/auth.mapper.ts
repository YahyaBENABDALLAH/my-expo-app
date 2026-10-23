import type { AuthSession } from '@/types/auth-session.types';
import { tokenResponseSchema } from '@/validation/schemas/api/auth';
import { authSessionSchema } from '@/validation/schemas/auth-session';

/** Pure validation/mapping shared by fresh tokens and supported on-device formats. */
export function normalizeAuthSession(data: unknown): AuthSession {
  if (data && typeof data === 'object' && 'accessTokenExpiresAtUtc' in data) {
    // Older builds stored the Identity token response directly.
    const token = tokenResponseSchema.safeParse(data);
    if (!token.success) throw new Error('Invalid authentication response.');
    const value = token.data;
    return {
      accessToken: value.accessToken,
      refreshToken: value.refreshToken,
      expiresAtUtc: value.accessTokenExpiresAtUtc,
      user: {
        uuid: value.userId,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
      },
    };
  }
  const stored = authSessionSchema.safeParse(data);
  if (!stored.success) throw new Error('Invalid saved authentication session.');
  return stored.data;
}
