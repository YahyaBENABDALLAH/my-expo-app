import type { ApiError as ApiErrorShape } from "@/types/api.types";

export class ApiError extends Error implements ApiErrorShape {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
    public readonly displayMessage: string | string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}
