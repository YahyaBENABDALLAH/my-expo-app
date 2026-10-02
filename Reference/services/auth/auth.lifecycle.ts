import { router } from "expo-router";
import { consumePendingAuthenticatedHref } from "@/lib/pending-navigation";
import type { TokenResponse } from "@/types/auth.types";
import { logout } from "./auth.api";
import { requestNewToken } from "./auth.refresh";
import {
  assertSessionVersion,
  clearAuthSession,
  establishAuthSession,
  getAuthSession,
  getSessionVersion,
} from "./auth.session";

export async function establishSession(token: TokenResponse, expectedVersion: number) {
  const { version } = await establishAuthSession(token, expectedVersion);
  assertSessionVersion(version);
  router.replace(consumePendingAuthenticatedHref() ?? "/(tabs)");
}

let pendingLogout: { version: number; promise: Promise<void> } | null = null;

/** Revoke remotely when reachable; always finish local cleanup. */
export function signOut(): Promise<void> {
  const version = getSessionVersion();
  if (pendingLogout?.version === version) return pendingLogout.promise;
  const promise = logout()
    // Remote revocation is best-effort; local cleanup must still succeed.
    .catch(() => {})
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
  if (version !== getSessionVersion()) return session;

  const expiresAt = session?.expiresAtUtc ? Date.parse(session.expiresAtUtc) : NaN;
  if (session && !(expiresAt > Date.now())) {
    // Keep cached identity available offline; API requests retry refresh as needed.
    void requestNewToken(version).catch(() => {});
  }
  return session;
}
