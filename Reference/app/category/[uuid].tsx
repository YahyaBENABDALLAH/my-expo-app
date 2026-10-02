import CategoryScreen from "@/features/category/category-screen";
import { getSingleRouteParam } from "@/lib/route-params";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function CategoryRoute() {
  const params = useLocalSearchParams<{ uuid?: string | string[] }>();
  const uuid = getSingleRouteParam(params.uuid);

  if (!uuid) {
    return <Redirect href="/" />;
  }

  return <CategoryScreen uuid={uuid} />;
}
