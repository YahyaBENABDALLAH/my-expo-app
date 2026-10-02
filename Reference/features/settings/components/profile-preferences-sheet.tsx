import { BottomSheet } from "@/components/Universal/bottom-sheet";
import { Button } from "@/components/Universal/button";
import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import { Picker } from "@/components/Universal/picker";
import { RNHostView } from "@/components/Universal/rn-host-view";
import { Switch } from "@/components/Universal/switch";
import { Text } from "@/components/Universal/text";
import { Card } from "@/components/ui/surface";
import { UserAvatar } from "@/components/user-avatar";
import { useThemeContext } from "@/context/theme.context";
import type { Lang } from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

interface ProfilePreferencesSheetProps {
  currentLanguageLabel: string;
  currentThemeLabel: string;
  isDark: boolean;
  isPresented: boolean;
  language: Lang;
  languageOptions: readonly { label: string; value: Lang }[];
  onBecomeChef: () => void;
  onDismiss: () => void;
  onLanguageChange: (language: Lang) => void;
  profile: {
    fullName: string;
    imgSrc?: { uri: string };
    initials: string;
    username: string;
  };
  showBecomeChef: boolean;
}

export function ProfilePreferencesSheet({
  currentLanguageLabel,
  currentThemeLabel,
  isDark,
  isPresented,
  language,
  languageOptions,
  onBecomeChef,
  onDismiss,
  onLanguageChange,
  profile,
  showBecomeChef,
}: ProfilePreferencesSheetProps) {
  const { t } = useTranslation();
  const { colors, toggleColorScheme } = useThemeContext();

  return (
    <BottomSheet
      contentPadding={0}
      isPresented={isPresented}
      onDismiss={onDismiss}
      snapPoints={[{ fraction: 0.8 }]}
    >
      <RNHostView>
        <ScrollView
          style={{ maxHeight: 500, paddingHorizontal: 20, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 24, paddingBottom: 32 }}>
            <View style={{ gap: 6, paddingBottom: 8 }}>
              <Text style={[{ color: colors.secondary }, { fontSize: 28, fontWeight: "700" }]}>
                {t("profile.title") || "My Profile"}
              </Text>
              <Text style={[{ color: colors.mutedForeground }, { fontSize: 14 }]}>
                {t("profile.description") || "Update your preferences and settings details below."}
              </Text>
            </View>

            <Card
              elevation="none"
              outlined
              radius={16}
              tone="muted"
              style={{ alignItems: "center", flexDirection: "row", gap: 16, padding: 16 }}
            >
              <UserAvatar
                profile={profile}
                style={{ borderColor: colors.primary, borderRadius: 9999, borderWidth: 1, height: 64, width: 64 }}
              />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[{ color: colors.secondary }, { fontSize: 18, fontWeight: "700" }]}>
                  {profile.fullName}
                </Text>
                {profile.username ? (
                  <Text style={[{ color: colors.mutedForeground }, { fontSize: 14 }]}>
                    {profile.username}
                  </Text>
                ) : null}
              </View>
            </Card>

            <Card elevation="none" outlined radius={16} tone="muted" style={{ gap: 16, padding: 20 }}>
              <Text style={[{ color: colors.secondary }, { fontSize: 18, fontWeight: "700" }]}>
                {t("profile.preferences") || "Preferences"}
              </Text>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 16 }}>
                <Icon name={isDark ? icons.moonStars : icons.sun} color={colors.primary} size={22} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}>
                    {t("common.theme") || "Theme"}
                  </Text>
                  <Text style={[{ color: colors.mutedForeground }, { fontSize: 14 }]}>
                    {currentThemeLabel}
                  </Text>
                </View>
                <Switch value={isDark} onValueChange={toggleColorScheme} testID="profile-theme-switch" />
              </View>

              <View style={{ backgroundColor: colors.border, height: 1 }} />

              <View style={{ alignItems: "center", flexDirection: "row", gap: 16 }}>
                <Icon name={icons.languages} color={colors.primary} size={22} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}>
                    {t("common.language") || "Language"}
                  </Text>
                  <Text style={[{ color: colors.mutedForeground }, { fontSize: 14 }]}>
                    {currentLanguageLabel}
                  </Text>
                </View>
                <Host matchContents>
                  <Picker
                    appearance="menu"
                    onValueChange={(nextLanguage) =>
                      onLanguageChange(nextLanguage as Lang)
                    }
                    selectedValue={language}
                    testID="profile-language-picker"
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
              </View>
            </Card>

            {showBecomeChef ? (
              <Card elevation="none" radius={16} style={{ backgroundColor: "#d97706", gap: 14, padding: 20 }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
                  <Icon name={icons.chef} color="#ffffff" size={28} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[{ color: "#ffffff" }, { fontSize: 18, fontWeight: "700" }]}>
                      {t("chefProfile.cardTitle") || "Become a Chef"}
                    </Text>
                    <Text style={[{ color: "#ffffff" }, { fontSize: 14 }]}>
                      {t("chefProfile.cardDescription") || "Share recipes with the community."}
                    </Text>
                  </View>
                </View>
                <Button fullWidth semantic="warning" label={t("chefProfile.becomeChef")} onPress={onBecomeChef} />
              </Card>
            ) : null}
          </View>
        </ScrollView>
      </RNHostView>
    </BottomSheet>
  );
}
