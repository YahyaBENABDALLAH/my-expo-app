import {
  establishAuthSession,
  getAuthSession,
  getSessionVersion,
  assertSessionVersion,
  isSessionClearing,
  clearAuthSession,
} from './auth.session';
import { requestNewToken } from './auth.refresh';
import { logout } from './auth.api';
import { reportErrorAlert } from '@/lib/error-alerts';

export { establishAuthSession as establishSession };

let pendingLogout: { version: number; promise: Promise<void> } | null = null;

async function endSession(version: number) {
  const accessToken = (await getAuthSession())?.accessToken;
  assertSessionVersion(version);
  await clearAuthSession(version);
  if (accessToken) {
    void logout(accessToken).catch(() => {
      // Local sign-out is complete. An old revoke failure must not alert a new account.
    });
  }
}

/** Complete durable local sign-out without waiting for best-effort revocation. */
export function signOut(): Promise<void> {
  const version = getSessionVersion();
  if (
    pendingLogout &&
    (pendingLogout.version === version || isSessionClearing(pendingLogout.version))
  )
    return pendingLogout.promise;
  const promise = endSession(version).finally(() => {
    if (pendingLogout?.promise === promise) pendingLogout = null;
  });
  pendingLogout = { version, promise };
  return promise;
}

export async function restoreSession() {
  const version = getSessionVersion();
  const session = await getAuthSession();
  if (version === getSessionVersion() && session) {
    const accessTokenValid = Date.parse(session.expiresAtUtc ?? '') > Date.now();
    if (!accessTokenValid) {
      // Keep the cached identity during temporary network failures.
      void requestNewToken(version).catch(reportErrorAlert);
    }
  }
  return session;
}
