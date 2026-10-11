import {
  clearAuthSession,
  getAccessToken,
  getSessionVersion,
  assertSessionVersion,
} from '@/services/auth/auth.session';
import { isSessionInvalid, SessionChangedError } from '@/services/auth/auth.errors';
import { ApiConfigurationError, ApiError, ApiResponseValidationError } from '@/services/api.error';
import { requestNewToken } from '@/services/auth/auth.refresh';
import i18n, { getCurrentLanguage } from '@/lib/i18n';
import type { z } from 'zod';
import {
  create,
  AxiosHeaders,
  AxiosError,
  isAxiosError,
  isCancel,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

export const HTTP_METHOD = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
} as const;
type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];
type QueryParamValue = boolean | number | string;
type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _authVersion?: number;
  _authAccessToken?: string | null;
};

export type ApiQueryParams = Record<string, QueryParamValue | null | undefined>;

export interface ApiRequestOptions<TBody = unknown, TResponse = unknown> {
  baseUrl?: string;
  body?: TBody;
  headers?: Record<string, string>;
  params?: ApiQueryParams;
  timeoutMs?: number;
  signal?: AbortSignal;
  responseSchema?: z.ZodType<TResponse>;
}

export { ApiError } from '@/services/api.error';

const STATUS_FALLBACKS: Record<number, string> = {
  0: 'api.network',
  400: 'api.invalidRequest',
  401: 'auth.sessionExpired',
  403: 'api.forbidden',
  404: 'api.notFound',
  409: 'api.conflict',
  422: 'api.invalidData',
  429: 'api.tooMany',
  500: 'api.server',
};

const DEFAULT_API_TIMEOUT_MS = 10000;

export function extractApiMessage(data: unknown): string | string[] | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message) && message.length > 0) {
    return message.map(String);
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    return message.trim();
  }

  const validationErrors = record.errors;

  if (validationErrors && typeof validationErrors === 'object') {
    const messages = Object.values(validationErrors as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((value) => String(value).trim())
      .filter(Boolean);

    if (messages.length > 0) {
      return messages;
    }
  }

  if (typeof record.detail === 'string' && record.detail.trim().length > 0) {
    return record.detail.trim();
  }

  if (typeof record.title === 'string' && record.title.trim().length > 0) {
    return record.title.trim();
  }

  return null;
}

function getBaseUrl(override?: string) {
  const baseUrl = (override ?? process.env.EXPO_PUBLIC_API_URL)?.trim();

  if (!baseUrl) {
    throw new ApiConfigurationError();
  }

  return baseUrl.replace(/\/+$/, '');
}

function getDisplayMessage(status: number, data: unknown) {
  return (
    extractApiMessage(data) ??
    (STATUS_FALLBACKS[status]
      ? i18n.t(STATUS_FALLBACKS[status])
      : i18n.t('api.unexpected', { status }))
  );
}

function toApiError(error: unknown) {
  if (isCancel(error) || error instanceof SessionChangedError) return error;
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data ?? null;
    const message =
      error.code === 'ECONNABORTED'
        ? `API request timed out after ${DEFAULT_API_TIMEOUT_MS}ms`
        : error.message || `API request failed with status ${status}`;

    return new ApiError(message, status, data, getDisplayMessage(status, data));
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, null, error.message);
  }

  return new ApiError(
    'API request failed before receiving a response',
    0,
    null,
    i18n.t(STATUS_FALLBACKS[0]),
  );
}

async function attachRequestMetadata(config: InternalAxiosRequestConfig, includeAuth: boolean) {
  const headers = AxiosHeaders.from({
    Accept: 'application/json',
    'Accept-Language': getCurrentLanguage(),
    ...(config.headers as Record<string, string> | undefined),
  });

  if (!headers.has('Content-Type') && !(config.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!includeAuth) {
    config.headers = headers;
    return config;
  }

  const authConfig = config as RetryableAxiosRequestConfig;
  authConfig._authVersion ??= getSessionVersion();
  assertSessionVersion(authConfig._authVersion);
  const accessToken = await getAccessToken();
  assertSessionVersion(authConfig._authVersion);
  authConfig._authAccessToken = accessToken;

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  } else {
    headers.delete('Authorization');
  }

  config.headers = headers;
  return config;
}

export function createAxiosInstance(
  baseURL: string | undefined,
  {
    includeAuth = true,
    skipInterceptor = false,
  }: {
    includeAuth?: boolean;
    skipInterceptor?: boolean;
  } = {},
): AxiosInstance {
  const instance = create({
    timeout: DEFAULT_API_TIMEOUT_MS,
  });

  instance.interceptors.request.use(async (config) => {
    config.baseURL = getBaseUrl(config.baseURL ?? baseURL);
    return attachRequestMetadata(config, includeAuth);
  });

  instance.interceptors.response.use(
    (response) => {
      const config = response.config as RetryableAxiosRequestConfig;
      if (includeAuth && config._authVersion !== undefined) {
        assertSessionVersion(config._authVersion);
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalConfig = error.config as RetryableAxiosRequestConfig | undefined;
      const isUnauthorized = error.response?.status === 401;

      if (!skipInterceptor && includeAuth && isUnauthorized && originalConfig) {
        try {
          const version = originalConfig._authVersion;
          // Only handle errors for requests belonging to the current session.
          if (version === undefined) throw error;
          assertSessionVersion(version);
          if (isSessionInvalid(error)) {
            await clearAuthSession(version);
          } else if (!originalConfig._retry) {
            originalConfig._retry = true;
            const currentToken = await getAccessToken();
            assertSessionVersion(version);
            // A late 401 may refer to a token another request already rotated.
            if (!currentToken || currentToken === originalConfig._authAccessToken) {
              await requestNewToken(version);
            }
            assertSessionVersion(version);
            return instance(originalConfig);
          }
        } catch (refreshError) {
          return Promise.reject(toApiError(refreshError));
        }
      }

      return Promise.reject(toApiError(error));
    },
  );

  return instance;
}

async function requestData<TResponse, TBody = unknown>(
  instance: AxiosInstance,
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions<TBody, TResponse> = {},
) {
  const response = await instance.request<TResponse>({
    baseURL: options.baseUrl,
    data: options.body,
    headers: options.headers,
    method,
    params: options.params,
    signal: options.signal,
    timeout: options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
    url: path,
  });

  if (!options.responseSchema) return response.data;
  const parsed = options.responseSchema.safeParse(response.data);
  if (!parsed.success) throw new ApiResponseValidationError(response.status);
  return parsed.data;
}

export function createApiClient({
  baseUrl,
  includeAuth = true,
  skipInterceptor = false,
}: {
  baseUrl?: string;
  includeAuth?: boolean;
  skipInterceptor?: boolean;
} = {}) {
  let instance: AxiosInstance | undefined;
  const getInstance = () => {
    instance ??= createAxiosInstance(baseUrl, {
      includeAuth,
      skipInterceptor,
    });
    return instance;
  };

  return {
    delete: <TResponse>(
      path: string,
      options?: Omit<ApiRequestOptions<unknown, TResponse>, 'body'>,
    ) => requestData<TResponse>(getInstance(), 'DELETE', path, options),
    get: <TResponse>(path: string, options?: Omit<ApiRequestOptions<unknown, TResponse>, 'body'>) =>
      requestData<TResponse>(getInstance(), 'GET', path, options),
    patch: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody, TResponse>, 'body'>,
    ) =>
      requestData<TResponse, TBody>(getInstance(), 'PATCH', path, {
        ...options,
        body,
      }),
    post: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody, TResponse>, 'body'>,
    ) =>
      requestData<TResponse, TBody>(getInstance(), 'POST', path, {
        ...options,
        body,
      }),
    put: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<ApiRequestOptions<TBody, TResponse>, 'body'>,
    ) =>
      requestData<TResponse, TBody>(getInstance(), 'PUT', path, {
        ...options,
        body,
      }),
  };
}

/**
 * Generic helper to build sanitized API query parameters from a raw query object.
 * Trims strings, removes undefined/null/empty strings, and retains booleans, numbers, and strings.
 */
export function buildListParams<T extends object>(
  query: T,
  defaults?: Partial<T>,
): Record<string, boolean | number | string> {
  const params: Record<string, boolean | number | string> = {};
  const mergedQuery = { ...defaults, ...query };

  for (const [key, val] of Object.entries(mergedQuery)) {
    if (val === undefined || val === null) continue;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed !== '') {
        params[key] = trimmed;
      }
    } else if (typeof val === 'boolean' || typeof val === 'number') {
      params[key] = val;
    }
  }

  return params;
}

export const apiClient = createApiClient();
