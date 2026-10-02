import { Button } from "@/components/Universal/button";
import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { SignInForm } from "@/features/auth/sign-in-form";
import { RADIUS, space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";

const STORAGE_KEY = "foodiya.onboarding.v1";
const steps = ["discover", "save", "cook"] as const;
const illustrations = [icons.food, icons.heart, icons.chef];

export function AuthEntry() {
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active) setCompleted(value === "true");
      })
      .catch(() => {
        if (active) setCompleted(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function finish() {
    setCompleted(true);
    // Onboarding storage must never prevent sign-in.
    void AsyncStorage.setItem(STORAGE_KEY, "true").catch(() => {});
  }

  if (completed === null)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  if (completed) return <SignInForm />;

  return (
    <AuthScreen
      title={t(`onboarding.${steps[page]}.title`)}
      subtitle={t(`onboarding.${steps[page]}.subtitle`)}
    >
      <Animated.View
        key={page}
        entering={reducedMotion ? undefined : FadeInDown.duration(240)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.muted,
          borderRadius: RADIUS.xlarge,
          paddingVertical: space(12),
          gap: space(6),
        }}
      >
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 144,
            height: 144,
            borderRadius: RADIUS.full,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name={illustrations[page]} size={64} color={colors.primary} />
        </View>
        <Text variant="small" semantic="muted">
          {t(`onboarding.${steps[page]}.detail`)}
        </Text>
      </Animated.View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: steps.length, now: page + 1 }}
        accessibilityLabel={t("onboarding.progress")}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: space(2),
        }}
      >
        {steps.map((step, index) => (
          <Animated.View
            key={step}
            style={{
              height: space(1.5),
              width: index === page ? space(8) : space(2),
              borderRadius: RADIUS.full,
              backgroundColor: index === page ? colors.primary : colors.border,
              transitionProperty: "width",
              transitionDuration: reducedMotion ? 0 : 180,
            }}
          />
        ))}
      </View>
      <Button
        fullWidth
        size="lg"
        label={t(
          page === steps.length - 1 ? "onboarding.start" : "auth.continue",
        )}
        onPress={() =>
          page === steps.length - 1 ? finish() : setPage(page + 1)
        }
      />
      <Button
        variant="text"
        semantic="secondary"
        label={t("onboarding.skip")}
        onPress={finish}
      />
      {page > 0 ? (
        <Button
          variant="text"
          label={t("onboarding.back")}
          onPress={() => setPage(page - 1)}
        />
      ) : null}
    </AuthScreen>
  );
}
