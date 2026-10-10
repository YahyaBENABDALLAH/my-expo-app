/** Preserve the identifier contract used by recipe and category route links. */
export function isValidRouteIdentifier(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{1,128}$/.test(value);
}
