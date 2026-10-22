import {
  establishAuthSession,
  getAuthSession,
  getSessionVersion,
  clearAuthSession,
} from './auth.session';
import { requestNewToken } from './auth.refresh';
import { logout } from './auth.api';
import { reportErrorAlert } from '@/lib/error-alerts';

export { establishAuthSession as establishSession };

let pendingLogout: { version: number; promise: Promise<void> } | null = null;

/** Remote revocation is best effort; local removal must finish even offline. */
export function signOut(): Promise<void> {
  const version = getSessionVersion();
  if (pendingLogout?.version === version) return pendingLogout.promise;
  const promise = logout()
    .catch(reportErrorAlert)
    .then(() => clearAuthSession(version))
    .finally(() => {
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
