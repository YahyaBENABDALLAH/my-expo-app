import { Button } from "@/components/Universal/button";
import { Host } from "@/components/Universal/host";
import { Switch } from "@/components/Universal/switch";
import { Icon, icons } from "@/components/Universal/icon";
import { Picker } from "@/components/Universal/picker";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { UserAvatar } from "@/components/user-avatar";
import { useAlert } from "@/components/ui/alert";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from "@/constants/app.constant";
import { THEME_MODE } from "@/constants/theme.constant";
import { useAuthContext } from "@/context/auth.context";
import { useCreateRecipeContext } from "@/context/create-recipe.context";
import { useLanguageContext } from "@/context/language.context";
import { useThemeContext } from "@/context/theme.context";
import { ProfilePreferencesSheet } from "@/features/settings/components/profile-preferences-sheet";
import type { Lang } from "@/lib/i18n";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, ScrollView, View } from "react-native";

const languageLabelKey: Record<Lang, string> = {
  ar: "common.arabic",
  en: "common.english",
  fr: "common.french",
};
const LANGUAGE_SEQUENCE: Lang[] = ["fr", "en", "ar"];

const ROUTE_PATH = {
  BECOME_CHEF: "/become-chef",
  HEALTH_CHECK: "/health-check",
  INGREDIENTS: "/ingredients",
  DEVICE_INFO: "/device-info",
} as const;
type RoutePath = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH];

export default function MoreTabScreen() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme, colors } = useThemeContext();
  const { language, setLanguage } = useLanguageContext();
  const { user, signOut } = useAuthContext();
  const alert = useAlert();
  const [isSigningOut, setSigningOut] = useState(false);
  const { onOpenProfileRef } = useCreateRecipeContext();

  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const isDark = colorScheme === THEME_MODE.DARK;
  const showBecomeChef = user?.isChef === false;

  const currentLanguageLabel = t(languageLabelKey[language]);
  const currentThemeLabel =
    colorScheme === THEME_MODE.DARK
      ? t("common.darkMode")
      : t("common.lightMode");

  const languageOptions = LANGUAGE_SEQUENCE.map((langOption) => ({
    label: t(languageLabelKey[langOption]),
    value: langOption,
  }));

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.userName?.trim() ||
    user?.email?.trim() ||
    t("common.account");

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A";

  const profileData = {
    fullName,
    initials,
    imgSrc: user?.profileImageUrl ? { uri: user.profileImageUrl } : undefined,
    username: user?.userName?.trim() || user?.email?.trim() || "",
  };

  // Expose open profile sheet callback to the center tab button
  useEffect(() => {
    onOpenProfileRef.current = () => setIsProfileVisible(true);
    return () => {
      onOpenProfileRef.current = null;
    };
  }, [onOpenProfileRef]);

  const handleNavigate = (path: RoutePath) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      alert.error(t("auth.errorTitle"), getAuthErrorMessage(error));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "transparent",
        paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_MARGIN,
        paddingTop: 16,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ gap: 6, paddingBottom: 8 }}>
          <Text
            style={[{ color: colors.secondary }, { fontSize: 32, fontWeight: "700" }]}
          >
            {t("profile.title") || "Settings"}
          </Text>
          <Text
            style={[{ color: colors.mutedForeground }, { fontSize: 14, fontWeight: "400" }]}
          >
            {t("profile.description") ||
              "Manage your account, preferences and settings."}
          </Text>
        </View>

        {/* User Card */}
        <Card
          elevation="none"
          outlined
          radius={16}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: 16,
          }}
        >
          <UserAvatar
            profile={profileData}
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={[{ color: colors.secondary }, { fontSize: 18, fontWeight: "700" }]}
            >
              {fullName}
            </Text>
            {profileData.username ? (
              <Text
                style={[{ color: colors.mutedForeground }, { fontSize: 14, fontWeight: "400", lineHeight: 16 }]}
              >
                {profileData.username}
              </Text>
            ) : null}
          </View>
        </Card>

        {/* Menu Options */}
        <View style={{ gap: 14 }}>
          {/* My Profile / Preferences Link - Opens BottomSheet */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
            onPress={() => setIsProfileVisible(true)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon name={icons.userCircle} color={colors.primary} size={20} />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {t("profile.title") || "My Profile"}
              </Text>
            </View>
            <Icon
              name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
              color={colors.mutedForeground}
              size={20}
            />
          </Card>
          {/* System Alerts Link */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
            onPress={() => handleNavigate(ROUTE_PATH.HEALTH_CHECK)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: "#ef4444",
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon name={icons.bell} color="#dc2626" size={20} />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {t("common.healthCheck") || "System Health"}
              </Text>
            </View>
            <Icon
              name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
              color={colors.mutedForeground}
              size={20}
            />
          </Card>

          {/* Become a Chef Link */}
          {showBecomeChef && (
            <Card
              elevation="none"
              outlined
              radius={16}
              style={{
                height: 56,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 12,
              }}
              onPress={() => handleNavigate(ROUTE_PATH.BECOME_CHEF)}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
              >
                <View
                  style={{
                    backgroundColor: "#d97706",
                    opacity: 0.1,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                  }}
                >
                  <Icon name={icons.chef} color="#d97706" size={20} />
                </View>
                <Text
                  style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
                >
                  {t("chefProfile.becomeChef") || "Become a Chef"}
                </Text>
              </View>
              <Icon
                name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
                color={colors.mutedForeground}
                size={20}
              />
            </Card>
          )}

          {/* Ingredients Link */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
            onPress={() => handleNavigate(ROUTE_PATH.INGREDIENTS)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: "#16a34a",
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon name={icons.nutrition} color="#16a34a" size={20} />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {t("common.ingredients") || "Ingredients"}
              </Text>
            </View>
            <Icon
              name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
              color={colors.mutedForeground}
              size={20}
            />
          </Card>

          {/* Device Info Link */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
            onPress={() => handleNavigate(ROUTE_PATH.DEVICE_INFO)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: "#2563eb",
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon name={icons.smartphone} color="#2563eb" size={20} />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                Device Info
              </Text>
            </View>
            <Icon
              name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
              color={colors.mutedForeground}
              size={20}
            />
          </Card>

          {/* Dark Mode Row */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: "#4f46e5",
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon
                  name={isDark ? icons.moonStars : icons.sun}
                  color="#4f46e5"
                  size={20}
                />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {t("common.darkMode") || "Dark Mode"}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              testID="more-theme-switch"
            />
          </Card>

          {/* Language Selector Row */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  backgroundColor: "#0d9488",
                  opacity: 0.1,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                }}
              >
                <Icon name={icons.languages} color="#0d9488" size={20} />
              </View>
              <Text
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {t("common.language") || "Language"}
              </Text>
            </View>
            <Host matchContents>
              <Picker
                appearance="menu"
                onValueChange={(nextLanguage) => {
                  void setLanguage(nextLanguage as Lang);
                }}
                selectedValue={language}
                testID="more-language-picker"
              >
                {languageOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </Host>
          </Card>
        </View>

        {/* Sign Out Button */}
        <Button
          fullWidth
          semantic="destructive"
          size="lg"
          style={{
            borderRadius: 16,
          }}
          containerStyle={{ marginTop: 16 }}
          onPress={handleSignOut}
          label={t("common.signOut") || "Sign Out"}
          loading={isSigningOut}
        />
      </ScrollView>

      <ProfilePreferencesSheet
        currentLanguageLabel={currentLanguageLabel}
        currentThemeLabel={currentThemeLabel}
        isDark={isDark}
        isPresented={isProfileVisible}
        language={language}
        languageOptions={languageOptions}
        onBecomeChef={() => {
          setIsProfileVisible(false);
          router.push(ROUTE_PATH.BECOME_CHEF);
        }}
        onDismiss={() => setIsProfileVisible(false)}
        onLanguageChange={(nextLanguage) => void setLanguage(nextLanguage)}
        profile={profileData}
        showBecomeChef={showBecomeChef}
      />
    </View>
  );
}
