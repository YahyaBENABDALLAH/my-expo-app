import { Card } from "@/components/ui/surface";
import { View } from "react-native";
import { Skeleton } from "./skeleton";

export function SearchResultCardSkeleton() {
  return (
    <Card
      elevation="item"
      style={{ flexDirection: "row", overflow: "hidden" }}
    >
      {/* Image placeholder */}
      <Skeleton style={{ width: 96, height: 96, borderRadius: 14 }} />

      {/* Text content */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: 8,
          paddingVertical: 4,
        }}
      >
        <View style={{ gap: 4 }}>
          <Skeleton style={{ height: 12, width: 64, borderRadius: 9999 }} />
          <Skeleton style={{ height: 20, borderRadius: 9999, width: "80%" }} />
        </View>

        <Skeleton style={{ height: 20, width: 96, borderRadius: 9999 }} />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Skeleton style={{ height: 12, width: 64, borderRadius: 9999 }} />
          <Skeleton style={{ height: 12, width: 48, borderRadius: 9999 }} />
        </View>
      </View>
    </Card>
  );
}
