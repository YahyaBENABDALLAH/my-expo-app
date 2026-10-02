export type ApiError = {
  message: string;
  name: string;
  status: number;
  data: unknown;
  displayMessage: string | string[];
};
