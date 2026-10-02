export type RouteParam = string | string[] | undefined;

export function getSingleRouteParam(value: RouteParam) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate?.trim();
  return normalized || undefined;
}
