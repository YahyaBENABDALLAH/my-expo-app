import { create } from 'axios';
import type { TokenResponse } from '@/types/auth.types';
import { DEFAULT_API_TIMEOUT_MS, getApiBaseUrl } from '../api.config';
import { isSessionInvalid } from './auth.errors';
import {
  assertSessionVersion,
  clearAuthSession,
  getAuthSession,
  getSessionVersion,
  persistAuthSession,
} from './auth.session';

// Raw transport prevents interceptor recursion.
const refreshClient = create({
  timeout: DEFAULT_API_TIMEOUT_MS,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

let activeRefresh: { version: number; promise: Promise<void> } | null = null;

async function rotateToken(version: number) {
  assertSessionVersion(version);
  const session = await getAuthSession();
  assertSessionVersion(version);
  if (!session?.refreshToken) {
    await clearAuthSession(version);
    throw new Error('No refresh token available.');
  }

  let token: TokenResponse;
  try {
    const response = await refreshClient.post<TokenResponse>(
      '/api/auth/token/refresh',
      { refreshToken: session.refreshToken },
      { baseURL: getApiBaseUrl() },
    );
    token = response.data;
  } catch (error) {
    if (isSessionInvalid(error)) await clearAuthSession(version);
    throw error;
  }

  assertSessionVersion(version);
  try {
    await persistAuthSession(token, version);
  } catch (error) {
    // Rotation consumes the old refresh token; discard it if saving fails.
    await clearAuthSession(version);
    throw error;
  }
  assertSessionVersion(version);
}

/** One refresh per session generation, shared by every caller. */
export function requestNewToken(version = getSessionVersion()): Promise<void> {
  if (activeRefresh?.version === version) return activeRefresh.promise;
  const promise = rotateToken(version).finally(() => {
    if (activeRefresh?.promise === promise) activeRefresh = null;
  });
  activeRefresh = { version, promise };
  return promise;
}
