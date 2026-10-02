import { BecomeChefForm } from "@/features/chef-profile/become-chef-form";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { RequireAuth } from "@/guards/require-auth";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function BecomeChefScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text variant="h2" style={{ color: colors.secondary }}>
            {t("chefProfile.heroTitle")}
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <BecomeChefForm />
        </KeyboardAvoidingView>
      </View>
    </RequireAuth>
  );
}
