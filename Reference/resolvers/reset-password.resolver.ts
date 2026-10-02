import { z } from "zod";
import type { ResetPasswordRequest } from "@/types/auth.types";

export const getResetPasswordSchema = (t: (key: string) => string) =>
  z.object({
    newPassword: z
      .string()
      .min(8, t("auth.passwordMinLength"))
      .max(128, t("auth.passwordMaxLength")),
    code: z
      .string()
      .min(1, t("auth.codeRequired"))
      .regex(/^\d{6}$/, t("auth.codeInvalid")),
  }) satisfies z.ZodType<Pick<ResetPasswordRequest, "newPassword" | "code">>;

export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;
