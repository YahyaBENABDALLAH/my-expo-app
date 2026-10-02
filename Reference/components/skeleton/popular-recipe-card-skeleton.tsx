import { Card } from "@/components/ui/surface";
import { View } from "react-native";
import { Skeleton } from "./skeleton";

export function PopularRecipeCardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ gap: 16, width }}>
      <Card style={{ height: width * 0.82, overflow: "hidden" }}>
        <Skeleton style={{ flex: 1 }} />
      </Card>
      <View style={{ gap: 8 }}>
        <Skeleton
          style={{ height: 28, borderRadius: 9999, width: width * 0.6 }}
        />
        <Skeleton
          style={{ height: 20, borderRadius: 9999, width: width * 0.42 }}
        />
      </View>
    </View>
  );
}
