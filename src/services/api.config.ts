import { DEFAULT_API_TIMEOUT_MS, resolveApiBaseUrl } from '../../config/api';
import { ApiConfigurationError } from './api.error';

export { DEFAULT_API_TIMEOUT_MS };

/** Lazy so the public starter can open without a configured backend. */
export function getApiBaseUrl(override?: string) {
  try {
    return resolveApiBaseUrl(override ?? process.env.EXPO_PUBLIC_API_URL);
  } catch (error) {
    throw new ApiConfigurationError(error instanceof Error ? error.message : undefined);
  }
}
