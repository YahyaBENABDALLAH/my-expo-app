import { z } from "zod";

export const getBecomeChefSchema = (t: (key: string) => string) =>
  z.object({
    displayName: z
      .string()
      .min(1, t("chefProfile.nameRequired"))
      .max(120, t("chefProfile.nameTooLong")),
    specialty: z
      .string()
      .max(150, t("chefProfile.specialtyTooLong"))
      .optional()
      .or(z.literal("")),
    yearsOfExperience: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;
        const num = Number.parseInt(val, 10);
        return !Number.isNaN(num) && num >= 0 && num <= 100;
      }, t("chefProfile.experienceInvalid")),
    bio: z
      .string()
      .max(1000, t("chefProfile.bioTooLong"))
      .optional()
      .or(z.literal("")),
  });

export type BecomeChefFormValues = z.infer<ReturnType<typeof getBecomeChefSchema>>;
