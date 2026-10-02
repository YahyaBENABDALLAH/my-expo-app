import { useAlert } from "@/components/ui/alert";
import { Card } from "@/components/ui/surface";
import { Button } from "@/components/Universal/button";
import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import {
  ControlledTextInput,
  type TextInputRef,
} from "@/components/Universal/text-input";
import { useTheme } from "@/context/theme.context";
import { BecomeChefFormValues, getBecomeChefSchema } from "@/resolvers";
import { ApiError } from "@/services/api";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { useCreateChefProfile } from "@/services/chef-profile/chef-profile.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

export function BecomeChefForm() {
  const specialtyInputRef = useRef<TextInputRef>(null);
  const experienceInputRef = useRef<TextInputRef>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const alert = useAlert();

  const schema = getBecomeChefSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BecomeChefFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      specialty: "",
      yearsOfExperience: "",
      bio: "",
    },
  });

  const { mutateAsync, isPending } = useCreateChefProfile({
    onSuccess: () => {
      alert.success(
        t("chefProfile.successTitle"),
        t("chefProfile.successMessage"),
      );
      router.back();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 403) {
        alert.error(
          t("chefProfile.errorTitle"),
          t(
            "chefProfile.forbiddenError",
            "Your account does not have permission to perform this action. Please make sure your database user has the correct role (e.g., 'Chef' or 'Admin').",
          ),
        );
      } else {
        alert.error(t("chefProfile.errorTitle"), getAuthErrorMessage(error));
      }
    },
  });

  async function onSubmit(data: BecomeChefFormValues) {
    const trimmedName = data.displayName.trim();
    const trimmedBio = data.bio?.trim();
    const trimmedSpecialty = data.specialty?.trim();
    const parsedExperience = data.yearsOfExperience?.trim()
      ? Number.parseInt(data.yearsOfExperience.trim(), 10)
      : null;

    const payload = {
      displayName: trimmedName,
      bio: trimmedBio || null,
      specialty: trimmedSpecialty || null,
      yearsOfExperience: parsedExperience,
    };

    await mutateAsync(payload);
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 8, marginBottom: 16 }}>
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 17, lineHeight: 28 }]}
        >
          {t("chefProfile.heroDescription")}
        </Text>
      </View>
      <Card
        elevation="none"
        outlined
        style={{ gap: 20, padding: 20 }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                backgroundColor: colors.primary,
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
              }}
            >
              <Icon name={icons.chef} color={colors.primary} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[{ color: colors.secondary }, {
                  fontSize: 22,
                  fontWeight: "600",
                  lineHeight: 28,
                }]}
              >
                {t("chefProfile.formTitle")}
              </Text>
              <Text
                style={[{ color: colors.mutedForeground }, { fontSize: 16, lineHeight: 24 }]}
              >
                {t("chefProfile.formDescription")}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 20 }}>
          {/* Display Name */}
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                label={`${t("chefProfile.displayName")} *`}
                placeholder={t("chefProfile.displayNamePlaceholder")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                editable={!isPending}
                maxLength={120}
                leftIcon={<Icon name={icons.user} size={24} color={colors.primary} />}
                onSubmitEditing={() => specialtyInputRef.current?.focus()}
                returnKeyType="next"
                error={errors.displayName?.message}
              />
            )}
          />

          {/* Specialty */}
          <Controller
            control={control}
            name="specialty"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                ref={specialtyInputRef}
                label={t("chefProfile.specialty")}
                placeholder={t("chefProfile.specialtyPlaceholder")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isPending}
                maxLength={150}
                leftIcon={
                  <Icon name={icons.chef} size={24} color={colors.primary} />
                }
                onSubmitEditing={() => experienceInputRef.current?.focus()}
                returnKeyType="next"
                error={errors.specialty?.message}
              />
            )}
          />

          {/* Years of Experience */}
          <Controller
            control={control}
            name="yearsOfExperience"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                ref={experienceInputRef}
                label={t("chefProfile.yearsOfExperience")}
                placeholder={t("chefProfile.yearsOfExperiencePlaceholder")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                editable={!isPending}
                maxLength={3}
                leftIcon={<Icon name={icons.award} size={24} color={colors.primary} />}
                returnKeyType="done"
                error={errors.yearsOfExperience?.message}
              />
            )}
          />

          {/* Bio */}
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                label={t("chefProfile.bio")}
                placeholder={t("chefProfile.bioPlaceholder")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isPending}
                maxLength={1000}
                multiline
                numberOfLines={6}
                style={{ height: 96 }}
                error={errors.bio?.message}
              />
            )}
          />

          <Button
            fullWidth
            containerStyle={{ marginTop: 8 }}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            label={isPending ? t("chefProfile.submitting") : t("chefProfile.submit")}
          />
        </View>
      </Card>
    </ScrollView>
  );
}
