/** Shared by Node configuration and native transports; no storage or native imports. */
const DEFAULT_API_TIMEOUT_MS = 10_000;

/** @param {string | undefined} value */
function resolveApiBaseUrl(value) {
  const input = value?.trim();
  if (!input) {
    throw new Error('Missing EXPO_PUBLIC_API_URL. Set it before calling the API.');
  }
  if (!/^https?:\/\//i.test(input)) {
    throw new Error('EXPO_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL.');
  }

  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error('EXPO_PUBLIC_API_URL must be an absolute HTTP or HTTPS URL.');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password ||
    input.includes('?') ||
    input.includes('#')
  ) {
    throw new Error(
      'EXPO_PUBLIC_API_URL must be an HTTP or HTTPS URL without credentials, query or fragment.',
    );
  }
  return url.toString().replace(/\/+$/, '');
}

module.exports = { DEFAULT_API_TIMEOUT_MS, resolveApiBaseUrl };
