import { z } from "zod";

export const getVerifyEmailSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .min(1, t("auth.codeRequired"))
      .regex(/^\d{6}$/, t("auth.codeInvalid")),
  });

export type VerifyEmailFormValues = z.infer<ReturnType<typeof getVerifyEmailSchema>>;
