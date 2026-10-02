import { Icon, icons } from "@/components/Universal/icon";
import { Host } from "@/components/Universal/host";
import { Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";

export function ErrorText({ message }: { message: string }) {
  const { colors } = useTheme();
  if (!message) return null;
  return (
    <Host
      matchContents
      style={{ marginTop: 4 }}
    >
      <Row alignment="center" spacing={space(1.5)}>
        <Icon name={icons.alertCircle} size={13} color={colors.destructive} />
        <Text
          style={[{ color: colors.destructive }, { fontSize: 12, fontWeight: "500" }]}
        >
          {message}
        </Text>
      </Row>
    </Host>
  );
}
