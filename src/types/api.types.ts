export type ApiErrorKind =
  'http' | 'network' | 'timeout' | 'configuration' | 'invalid-response' | 'unexpected';

export type ApiError = {
  kind: ApiErrorKind;
  message: string;
  name: string;
  status: number;
  data: unknown;
  displayMessage: string | string[];
};
