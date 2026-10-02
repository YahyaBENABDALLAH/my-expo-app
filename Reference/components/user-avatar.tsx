import { RADIUS } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { Image } from "expo-image";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

type UserProfile = {
  fullName: string;
  imgSrc?: { uri: string };
  initials: string;
  username: string;
};

const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: "Account",
  initials: "A",
  username: "",
};

export function UserAvatar({
  profile,
  style,
  ...props
}: Omit<ViewProps, "children"> & {
  profile?: UserProfile;
}) {
  const { colors, tokens } = useTheme();
  const resolvedProfile = profile ?? DEFAULT_USER_PROFILE;
  const imageUri = resolvedProfile.imgSrc?.uri.trim();
  const [failedImageUri, setFailedImageUri] = useState<string>();

  return (
    <View
      {...props}
      accessibilityLabel={`${resolvedProfile.fullName}'s avatar`}
      accessibilityRole="image"
      style={[
        styles.container,
        { backgroundColor: colors.muted },
        style,
      ]}
    >
      <Text
        accessible={false}
        style={{
          color: colors.mutedForeground,
          fontFamily: tokens.typography.text.small.fontFamily,
          fontSize: tokens.typography.text.small.fontSize,
          fontWeight: tokens.typography.text.small.fontWeight,
        }}
      >
        {resolvedProfile.initials}
      </Text>
      {imageUri && failedImageUri !== imageUri ? (
        <Image
          accessible={false}
          contentFit="cover"
          onError={() => setFailedImageUri(imageUri)}
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          transition={150}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: RADIUS.full,
    flexShrink: 0,
    height: 32,
    justifyContent: "center",
    overflow: "hidden",
    width: 32,
  },
});
