import { Button } from "@/components/Universal/button";
import { Host } from "@/components/Universal/host";
import {
  Column,
  RNHostView,
  Row,
  Spacer,
} from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { FONT_WEIGHT } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { type ReactNode } from "react";
import { View } from "react-native";

interface SectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onPressAction?: () => void;
  titleIcon?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  onPressAction,
  titleIcon,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <Host
      matchContents={{ horizontal: false, vertical: true }}
      useViewportSizeMeasurement
    >
      <Row alignment="end" spacing={8} style={{ paddingLeft: 16 }}>
        <Column spacing={2}>
          <Row alignment="center" spacing={8}>
            <Text
              style={[{ color: colors.secondary }, {
                fontSize: 30,
                fontWeight: FONT_WEIGHT.semibold,
                lineHeight: 38,
                letterSpacing: -1.2,
              }]}
            >
              {title}
            </Text>
            {titleIcon ? (
              <RNHostView matchContents>
                <View>{titleIcon}</View>
              </RNHostView>
            ) : null}
          </Row>
          <Text
            style={[{ color: colors.mutedForeground }, { fontSize: 18, lineHeight: 24 }]}
          >
            {description}
          </Text>
        </Column>

        {actionLabel ? (
          <>
            <Spacer flexible />
            <Button
              variant="text"
              size="sm"
              label={actionLabel}
              onPress={onPressAction}
            />
          </>
        ) : null}
      </Row>
    </Host>
  );
}
