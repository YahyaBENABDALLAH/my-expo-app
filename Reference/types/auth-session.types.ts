/** Frontend display model, not a Foodiya.Identity response DTO. */
export type AuthUser = {
  uuid?: string;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profileImageUrl?: string | null;
  isActive?: boolean;
  role?: string | null;
  isChef?: boolean;
  chefProfileUuid?: string | null;
};

/** Existing on-device storage format, independent of the wire contract. */
export type AuthSession = {
  accessToken: string;
  refreshToken: string | null;
  expiresAtUtc: string | null;
  user: AuthUser | null;
};
