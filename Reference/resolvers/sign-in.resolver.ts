import { z } from "zod";
import type { LoginRequest } from "@/types/auth.types";

export const getSignInSchema = (t: (key: string) => string) =>
  z.object({
    login: z.string().trim().min(1, t("auth.identityRequired")),
    password: z.string().min(1, t("auth.passwordRequired")),
  }) satisfies z.ZodType<Pick<LoginRequest, "login" | "password">>;

export type SignInFormValues = z.infer<ReturnType<typeof getSignInSchema>>;
