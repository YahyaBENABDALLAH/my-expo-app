import type { ApiError as ApiErrorShape, ApiErrorKind } from '@/types/api.types';
import i18n from '@/lib/i18n';

export class ApiError extends Error implements ApiErrorShape {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
    public readonly displayMessage: string | string[],
    public readonly kind: ApiErrorKind = status === 0 ? 'unexpected' : 'http',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Configuration failures cannot recover by repeating an HTTP request. */
export class ApiConfigurationError extends ApiError {
  constructor(message = 'Missing EXPO_PUBLIC_API_URL. Set it before calling the API client.') {
    super(message, 0, null, i18n.t('auth.requestFailed'), 'configuration');
    this.name = 'ApiConfigurationError';
  }
}

/** Do not attach the invalid body: auth responses can contain credentials. */
export class ApiResponseValidationError extends ApiError {
  constructor(status: number) {
    const message = i18n.t('api.invalidResponse');
    super(message, status, null, message, 'invalid-response');
    this.name = 'ApiResponseValidationError';
  }
}
