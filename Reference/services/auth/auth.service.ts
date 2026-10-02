import { ApiError } from "@/services/api.error";
import { isAxiosError } from "axios";
import i18n from "@/lib/i18n";
import { getAuthFailure, isSessionInvalid } from "./auth.errors";
import type {
  ProblemDetails,
  ValidationProblemDetails,
} from "@/types/problem.types";

// ── Types ────────────────────────────────────────────────────

type AuthProblemDetails = ProblemDetails | ValidationProblemDetails;

function isProblemDetails(data: unknown): data is AuthProblemDetails {
  return (
    data !== null &&
    typeof data === "object" &&
    "status" in data && typeof data.status === "number" &&
    "code" in data && typeof data.code === "string"
  );
}

function getProblemDetailsMessage(data: unknown) {
  if (!isProblemDetails(data)) {
    return null;
  }

  const validationErrors = "errors" in data ? data.errors : undefined;

  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.entries(validationErrors).flatMap(
      ([field, fieldErrors]) =>
        fieldErrors
          .map(value => String(value).trim())
          .filter(Boolean)
          .map(message => `${field}: ${message}`),
    );

    if (messages.length > 0) {
      return messages;
    }
  }

  if (typeof data.detail === "string" && data.detail.trim().length > 0) {
    return data.detail.trim();
  }

  if (typeof data.title === "string" && data.title.trim().length > 0) {
    return data.title.trim();
  }

  return null;
}

export function getAuthErrorMessage(error: unknown): string | string[] {
  const { status, code } = getAuthFailure(error);
  if (status === 401 && code === "INVALID_CREDENTIALS") {
    return i18n.t("auth.invalidCredentials");
  }
  if (isSessionInvalid(error)) return i18n.t("auth.sessionExpired");
  if ((status === 0 && (error instanceof ApiError || isAxiosError(error))) || status >= 500) {
    return i18n.t("auth.temporaryFailure");
  }
  if (status === 401) return i18n.t("auth.requestFailed");
  if (error instanceof ApiError) {
    return (
      getProblemDetailsMessage(error.data) ??
      error.displayMessage
    );
  }

  return i18n.t("auth.requestFailed");
}
