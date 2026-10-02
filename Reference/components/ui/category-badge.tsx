import { Host } from "@/components/Universal/host";
import { RNHostView, Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { SafePressable } from "@/components/ui/safe-pressable";
import { FONT_SIZE, FONT_WEIGHT } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

interface CategoryBadgeProps {
  name: string;
  iconUrl?: string | null;
  onPress?: () => void;
  isSelected?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  style?: ViewStyle;
  activeStyle?: ViewStyle;
  inactiveStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  inactiveTextStyle?: TextStyle;
}

export function CategoryBadge({
  name,
  iconUrl,
  onPress,
  isSelected,
  prefix,
  suffix,
  style,
  activeStyle,
  inactiveStyle,
  imageStyle,
  textStyle,
  activeTextStyle,
  inactiveTextStyle,
}: CategoryBadgeProps) {
  const { colors } = useTheme();
  const isSelectable = isSelected !== undefined;

  const containerStateStyle: ViewStyle = isSelectable
    ? isSelected
      ? (activeStyle ?? { backgroundColor: colors.primary })
      : (inactiveStyle ?? { backgroundColor: colors.muted })
    : { backgroundColor: colors.muted };

  const textStateStyle: TextStyle = isSelectable
    ? isSelected
      ? (activeTextStyle ?? { color: "#ffffff" })
      : (inactiveTextStyle ?? { color: colors.mutedForeground })
    : { color: colors.foreground };

  const imageSize: ImageStyle = isSelectable
    ? { width: 20, height: 20, borderRadius: 9999 }
    : { width: 24, height: 24, borderRadius: 9999 };

  return (
    <SafePressable
      accessibilityLabel={name}
      accessibilityState={
        isSelectable ? { selected: Boolean(isSelected) } : undefined
      }
      onPress={onPress}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          minHeight: 44,
          paddingHorizontal: 20,
          paddingVertical: 8,
        },
        containerStateStyle,
        style,
      ]}
    >
      <Host
        aria-hidden
        matchContents
        pointerEvents="none"
      >
        <Row alignment="center" spacing={8}>
          {prefix ? <ReactNativeSlot>{prefix}</ReactNativeSlot> : null}
          {iconUrl ? (
            <RNHostView
              matchContents
              style={{ height: imageSize.height, width: imageSize.width }}
            >
              <Image
                source={{ uri: iconUrl }}
                contentFit="cover"
                transition={150}
                style={[imageSize, imageStyle]}
              />
            </RNHostView>
          ) : null}
          <Text
            style={
              StyleSheet.flatten([
                {
                  fontSize: isSelectable ? FONT_SIZE.small : FONT_SIZE.large,
                  fontWeight: FONT_WEIGHT.semibold,
                },
                textStateStyle,
                textStyle,
              ]) as any
            }
          >
            {name}
          </Text>
          {suffix ? <ReactNativeSlot>{suffix}</ReactNativeSlot> : null}
        </Row>
      </Host>
    </SafePressable>
  );
}

function ReactNativeSlot({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      <View>{children}</View>
    </RNHostView>
  );
}
