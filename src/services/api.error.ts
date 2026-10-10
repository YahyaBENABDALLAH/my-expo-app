import type { ApiError as ApiErrorShape } from '@/types/api.types';
import i18n from '@/lib/i18n';

export class ApiError extends Error implements ApiErrorShape {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
    public readonly displayMessage: string | string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Do not attach the invalid body: auth responses can contain credentials. */
export class ApiResponseValidationError extends ApiError {
  constructor(status: number) {
    const message = i18n.t('api.invalidResponse');
    super(message, status, null, message);
    this.name = 'ApiResponseValidationError';
  }
}
