import * as SecureStore from 'expo-secure-store';
import { queryClient } from '@/lib/react-query';

import { SessionChangedError } from './auth.errors';
import type { AuthSession, AuthUser } from '@/types/auth-session.types';
import type { TokenResponse } from '@/types/auth.types';
import { authSessionSchema, tokenResponseSchema } from '@/validation/schemas/api/auth';

export type { AuthSession } from '@/types/auth-session.types';

const STORAGE_KEY = 'auth.session';
let currentSession: AuthSession | null | undefined;
let sessionVersion = 0;
let storageQueue: Promise<unknown> = Promise.resolve();
type SessionEvent = { session: AuthSession | null; reason: 'updated' | 'cleared' };
const listeners = new Set<(event: SessionEvent) => void>();

export function getSessionVersion() {
  return sessionVersion;
}

export function assertSessionVersion(version: number) {
  if (version !== sessionVersion) throw new SessionChangedError();
}

function queueStorage<T>(operation: () => Promise<T>): Promise<T> {
  const result = storageQueue.then(operation);
  storageQueue = result.catch(() => {});
  return result;
}

function publish(reason: SessionEvent['reason']) {
  for (const listener of listeners) listener({ session: currentSession ?? null, reason });
}

export function subscribeAuthSession(listener: (event: SessionEvent) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function normalizeSession(data: unknown): AuthSession {
  if (data && typeof data === 'object' && 'accessTokenExpiresAtUtc' in data) {
    // Retain restoration support for the previous wire-token storage format.
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
        role: value.roles[0] ?? null,
        isChef: value.roles.some((role) => role.toUpperCase() === 'CHEF'),
      },
    };
  }
  const stored = authSessionSchema.safeParse(data);
  if (!stored.success) throw new Error('Invalid saved authentication session.');
  return stored.data;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (currentSession !== undefined) return currentSession;
  const version = sessionVersion;
  await storageQueue;
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  assertSessionVersion(version);
  if (currentSession !== undefined) return currentSession;
  if (!raw) return (currentSession = null);
  try {
    currentSession = normalizeSession(JSON.parse(raw));
    return currentSession;
  } catch {
    await clearAuthSession(version);
    return null;
  }
}

export async function getAccessToken() {
  return (await getAuthSession())?.accessToken ?? null;
}

/** Serialize the entire token pair in one storage write. */
export function persistAuthSession(data: TokenResponse | AuthSession, version = sessionVersion) {
  const session = normalizeSession(data);
  return queueStorage(async () => {
    assertSessionVersion(version);
    const previousUser = currentSession?.user;
    if (previousUser && session.user?.uuid === previousUser.uuid) {
      const nextUser = { ...previousUser, ...session.user };
      session.user = Object.keys(nextUser).every(
        (key) => nextUser[key as keyof AuthUser] === previousUser[key as keyof AuthUser],
      )
        ? previousUser
        : nextUser;
    }
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
    assertSessionVersion(version);
    currentSession = session;
    publish('updated');
    return session;
  });
}

/** Common entry point for login, confirmation and Google token exchange. */
export async function establishAuthSession(token: TokenResponse, expectedVersion: number) {
  assertSessionVersion(expectedVersion);
  // Validate before starting a new session generation.
  normalizeSession(token);
  const version = ++sessionVersion;
  queryClient.clear();
  const session = await persistAuthSession(token, version);
  return { session, version };
}

/** Merge display metadata without overwriting a token pair rotated by another request. */
export function updateAuthUser(updates: Partial<AuthUser>, expectedVersion = sessionVersion) {
  return queueStorage(async () => {
    assertSessionVersion(expectedVersion);
    if (!currentSession?.user) throw new Error('account.loginUpdate');
    const session = normalizeSession({
      ...currentSession,
      user: { ...currentSession.user, ...updates },
    });
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
    assertSessionVersion(expectedVersion);
    currentSession = session;
    publish('updated');
    return session;
  });
}

/** Publish sign-out only after the stored credentials are durably removed. */
export async function clearAuthSession(expectedVersion = sessionVersion) {
  if (expectedVersion !== sessionVersion) return;
  const previousSession = currentSession;
  const clearVersion = ++sessionVersion;

  // Stop new requests from using credentials while durable cleanup is pending.
  currentSession = null;

  try {
    await queueStorage(() => SecureStore.deleteItemAsync(STORAGE_KEY));
  } catch (error) {
    // The UI has not received a cleared event, so restore the matching session
    // and let the caller show a retryable logout failure.
    if (sessionVersion === clearVersion) {
      sessionVersion = expectedVersion;
      currentSession = previousSession;
    }
    throw error;
  }

  // A newer session owns application state from this point onward.
  if (sessionVersion !== clearVersion) return;
  queryClient.clear();

  publish('cleared');
}
