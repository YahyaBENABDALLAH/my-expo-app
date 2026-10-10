import { apiClient, createApiClient } from '@/services/api';
import {
  authFlowResponseSchema,
  tokenResponseSchema,
  currentIdentityResponseSchema,
  messageResponseSchema,
} from '@/validation/schemas/api/auth';
import type { ApiReadOptions } from '../request-utils';
import type {
  AuthFlowResponse,
  ConfirmRegistrationRequest,
  CurrentIdentityResponse,
  GoogleSignInRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse,
} from '@/types/auth.types';

const authClient = createApiClient({
  includeAuth: false,
  skipInterceptor: true,
});

export function login(request: LoginRequest): Promise<AuthFlowResponse> {
  return authClient.post<AuthFlowResponse, LoginRequest>('/api/auth/login', request, {
    responseSchema: authFlowResponseSchema,
  });
}

export function register(request: RegisterRequest): Promise<AuthFlowResponse> {
  return authClient.post<AuthFlowResponse, RegisterRequest>('/api/auth/register', request, {
    responseSchema: authFlowResponseSchema,
  });
}

export function confirmRegistration(
  request: ConfirmRegistrationRequest,
): Promise<AuthFlowResponse> {
  return authClient.post<AuthFlowResponse, ConfirmRegistrationRequest>(
    '/api/auth/register/confirm',
    request,
    { responseSchema: authFlowResponseSchema },
  );
}

// The supplied contract names no DTOs for these inline request/response bodies.
export function resendRegistration(request: { email: string }): Promise<AuthFlowResponse> {
  return authClient.post<AuthFlowResponse, typeof request>('/api/auth/register/resend', request, {
    responseSchema: authFlowResponseSchema,
  });
}

export function googleSignIn(request: GoogleSignInRequest): Promise<TokenResponse> {
  return authClient.post<TokenResponse, GoogleSignInRequest>('/api/auth/google', request, {
    responseSchema: tokenResponseSchema,
  });
}

export function forgotPassword(request: { email: string }): Promise<{ message: string }> {
  return authClient.post<{ message: string }, typeof request>(
    '/api/auth/password/forgot',
    request,
    { responseSchema: messageResponseSchema },
  );
}

export async function resetPassword(request: ResetPasswordRequest): Promise<void> {
  await authClient.post<void, ResetPasswordRequest>('/api/auth/password/reset', request);
}

export function me(options: ApiReadOptions = {}): Promise<CurrentIdentityResponse> {
  return apiClient.get<CurrentIdentityResponse>('/api/users/me', {
    ...options,
    responseSchema: currentIdentityResponseSchema,
  });
}

export async function logout(): Promise<void> {
  await apiClient.post<void>('/api/auth/logout');
}
