import type { RegisterRequest } from "@/types/auth.types";
import { z } from "zod";

export const getSignUpSchema = (t: (key: string) => string) =>
  z.object({
    userName: z.string().trim().min(1, t("auth.usernameRequired")),
    firstName: z.string().trim().min(1, t("auth.firstNameRequired")),
    lastName: z.string().trim().min(1, t("auth.lastNameRequired")),
    email: z.string().trim().min(1, t("auth.emailRequired")).pipe(z.email(t("auth.invalidEmail"))),
    password: z.string().min(1, t("auth.passwordRequired")),
  }) satisfies z.ZodType<Omit<RegisterRequest, "preferredLanguage">>;

export type SignUpFormValues = z.infer<ReturnType<typeof getSignUpSchema>>;
