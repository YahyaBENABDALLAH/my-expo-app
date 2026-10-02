import { Button } from "@/components/Universal/button";
import { Column, Host } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { useRouter } from "expo-router";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export function AuthScreen({
  title,
  subtitle,
  back = false,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
  back?: boolean;
}>) {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: space(6),
          paddingTop: space(14),
          paddingBottom: space(8),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 480,
            alignSelf: "center",
            gap: space(8),
          }}
        >
          {back ? (
            <Button
              variant="text"
              size="sm"
              label={t("auth.backToSignIn")}
              onPress={() => router.replace("/(auth)")}
              containerStyle={{ alignSelf: "flex-start" }}
            />
          ) : null}
          <Host
            matchContents={{ horizontal: false, vertical: true }}
            useViewportSizeMeasurement
          >
            <Column spacing={space(3)}>
              <Text variant="caption" semantic="primary" weight="bold">
                FOODIYA
              </Text>
              <Text variant="h1">{title}</Text>
              <Text variant="body" semantic="muted">
                {subtitle}
              </Text>
            </Column>
          </Host>
          <View style={{ gap: space(5) }}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
