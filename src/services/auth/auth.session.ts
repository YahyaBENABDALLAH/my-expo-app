import * as SecureStore from 'expo-secure-store';
import { queryClient } from '@/lib/react-query';

import { SessionChangedError } from './auth.errors';
import type { AuthSession, AuthUser } from '@/types/auth-session.types';
import type { TokenResponse } from '@/types/auth.types';
import { normalizeAuthSession } from './auth.mapper';

export type { AuthSession } from '@/types/auth-session.types';

const STORAGE_KEY = 'auth.session';
let currentSession: AuthSession | null | undefined;
let sessionVersion = 0;
let storageQueue: Promise<unknown> = Promise.resolve();
let pendingClear: { version: number; clearVersion: number; promise: Promise<void> } | null = null;
type SessionEvent = { session: AuthSession | null; reason: 'updated' | 'cleared' };
const listeners = new Set<(event: SessionEvent) => void>();

export function getSessionVersion() {
  return sessionVersion;
}

export function assertSessionVersion(version: number) {
  if (version !== sessionVersion) throw new SessionChangedError();
}

/** Source generation whose durable removal still owns the temporary cleared state. */
export function isSessionClearing(version: number) {
  return pendingClear?.version === version && pendingClear.clearVersion === sessionVersion;
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

export async function getAuthSession(): Promise<AuthSession | null> {
  if (currentSession !== undefined) return currentSession;
  const version = sessionVersion;
  await storageQueue;
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  assertSessionVersion(version);
  if (currentSession !== undefined) return currentSession;
  if (!raw) {
    currentSession = null;
    return currentSession;
  }
  try {
    currentSession = normalizeAuthSession(JSON.parse(raw));
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
  const session = normalizeAuthSession(data);
  return queueStorage(async () => {
    assertSessionVersion(version);
    const previousUser = currentSession?.user;
    if (previousUser && session.user.uuid === previousUser.uuid) {
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
  normalizeAuthSession(token);
  const version = ++sessionVersion;
  queryClient.clear();
  const session = await persistAuthSession(token, version);
  return { session, version };
}

/** Merge display metadata without overwriting a token pair rotated by another request. */
export function updateAuthUser(updates: Partial<AuthUser>, expectedVersion = sessionVersion) {
  return queueStorage(async () => {
    assertSessionVersion(expectedVersion);
    if (!currentSession) throw new Error('account.loginUpdate');
    const session = normalizeAuthSession({
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
export function clearAuthSession(expectedVersion = sessionVersion): Promise<void> {
  if (
    pendingClear?.clearVersion === sessionVersion &&
    (expectedVersion === pendingClear.version || expectedVersion === pendingClear.clearVersion)
  )
    return pendingClear.promise;
  if (expectedVersion !== sessionVersion) return Promise.resolve();
  const previousSession = currentSession;
  const clearVersion = ++sessionVersion;

  // Stop new requests from using credentials while durable cleanup is pending.
  currentSession = null;

  const promise = queueStorage(() => SecureStore.deleteItemAsync(STORAGE_KEY))
    .catch((error: unknown) => {
      // Restore only this generation after a storage failure; newer sessions win.
      if (sessionVersion !== clearVersion) throw new SessionChangedError();
      sessionVersion = expectedVersion;
      currentSession = previousSession;
      throw error;
    })
    .then(() => {
      if (sessionVersion !== clearVersion) return;
      queryClient.clear();
      publish('cleared');
    })
    .finally(() => {
      if (pendingClear?.promise === promise) pendingClear = null;
    });
  pendingClear = { version: expectedVersion, clearVersion, promise };
  return promise;
}
