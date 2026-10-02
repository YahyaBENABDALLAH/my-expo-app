import { Card } from "@/components/ui/surface";
import { View } from "react-native";
import { Skeleton } from "./skeleton";

export function EditorsChoiceCardSkeleton({
  imageHeight,
}: {
  imageHeight: number;
}) {
  return (
    <Card style={{ overflow: "hidden" }}>
        <Skeleton style={{ width: "100%", height: imageHeight }} />

        <View
          style={{
            gap: 16,
            paddingHorizontal: 20,
            paddingBottom: 24,
            paddingTop: 16,
          }}
        >
          <Skeleton style={{ height: 32, width: 112, borderRadius: 9999 }} />

          <View style={{ gap: 8 }}>
            <Skeleton style={{ height: 32, width: 208, borderRadius: 9999 }} />
            <Skeleton
              style={{ height: 20, borderRadius: 9999, width: "100%" }}
            />
            <Skeleton
              style={{ height: 20, borderRadius: 9999, width: "78%" }}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
            <Skeleton style={{ height: 20, width: 80, borderRadius: 9999 }} />
            <Skeleton style={{ height: 20, width: 96, borderRadius: 9999 }} />
          </View>
        </View>
    </Card>
  );
}
