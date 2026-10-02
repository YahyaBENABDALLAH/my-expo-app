import {
  Icon,
  icons,
  type AppIconName,
} from "@/components/Universal/icon";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { ScrollView, View } from "react-native";

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "N/A";
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
};

const DataRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | boolean | null;
  icon: AppIconName;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + "0D",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            backgroundColor: colors.primary + "1A",
            padding: 8,
            borderRadius: 14,
          }}
        >
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <Text
          style={[{
            color: colors.mutedForeground,
          }, {
            fontSize: 15,
            fontWeight: "500",
          }]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[{
          color: colors.secondary,
        }, {
          fontSize: 15,
          fontWeight: "700",
          textAlign: "right",
        }]}
      >
        {value === null || value === undefined ? "N/A" : String(value)}
      </Text>
    </View>
  );
};

const InfoSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: AppIconName;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <Card elevation="item" outlined style={{ padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.primary,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
          }}
        >
          <Icon name={icon} size={20} color="#ffffff" />
        </View>
        <Text
          style={[{ color: colors.secondary }, { fontSize: 18, fontWeight: "700" }]}
        >
          {title}
        </Text>
      </View>
      <View style={{ gap: 2 }}>{children}</View>
    </Card>
  );
};

export default function DeviceInfoScreen() {
  const { deviceInfo: deviceData, networkInfo: networkData } = useDeviceInfo();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
        <Text variant="h2" style={{ color: colors.secondary }}>
          Device Info
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <InfoSection title="Hardware" icon={icons.cpu}>
          <DataRow label="Brand" value={deviceData?.brand} icon={icons.smartphone} />
          <DataRow label="Model" value={deviceData?.modelName} icon={icons.info} />
          <DataRow
            label="Name"
            value={deviceData?.deviceName}
            icon={icons.activity}
          />
          <DataRow
            label="Type"
            value={deviceData?.deviceType}
            icon={icons.smartphone}
          />
          <DataRow
            label="Memory"
            value={formatBytes(deviceData?.totalMemory ?? null)}
            icon={icons.hardDrive}
          />
        </InfoSection>

        <InfoSection title="Software" icon={icons.activity}>
          <DataRow label="OS Name" value={deviceData?.osName} icon={icons.info} />
          <DataRow
            label="OS Version"
            value={deviceData?.osVersion}
            icon={icons.activity}
          />
          <DataRow
            label="Is Device"
            value={deviceData?.isDevice}
            icon={icons.smartphone}
          />
        </InfoSection>

        <InfoSection title="Connectivity" icon={icons.wifi}>
          <DataRow
            label="IP Address"
            value={networkData?.ipAddress}
            icon={icons.globe}
          />
          <DataRow
            label="Network Type"
            value={networkData?.networkType}
            icon={icons.wifi}
          />
          <DataRow
            label="Connected"
            value={networkData?.isConnected}
            icon={icons.activity}
          />
          <DataRow
            label="Internet"
            value={networkData?.isInternetReachable}
            icon={icons.globe}
          />
        </InfoSection>
      </ScrollView>
    </View>
  );
}
