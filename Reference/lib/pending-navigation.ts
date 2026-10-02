import type { Href } from "expo-router";

const PENDING_ROUTE_TTL_MS = 30 * 60 * 1000;

interface PendingAuthenticatedRoute {
  expiresAt: number;
  href: Href;
}

let pendingAuthenticatedRoute: PendingAuthenticatedRoute | null = null;

export function setPendingAuthenticatedHref(href: Href) {
  pendingAuthenticatedRoute = {
    expiresAt: Date.now() + PENDING_ROUTE_TTL_MS,
    href,
  };
}

export function consumePendingAuthenticatedHref() {
  const pending = pendingAuthenticatedRoute;
  pendingAuthenticatedRoute = null;

  if (!pending || pending.expiresAt < Date.now()) {
    return null;
  }

  return pending.href;
}

export function clearPendingAuthenticatedHref() {
  pendingAuthenticatedRoute = null;
}
