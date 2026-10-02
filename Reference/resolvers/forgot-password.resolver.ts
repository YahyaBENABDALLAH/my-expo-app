import { z } from "zod";

export const getForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().min(1, t("auth.emailRequired")).pipe(z.email(t("auth.invalidEmail"))),
  });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof getForgotPasswordSchema>>;
