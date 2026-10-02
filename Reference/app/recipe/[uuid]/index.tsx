import RecipeDetailScreen from "@/features/recipe-detail/recipe-detail-screen";
import { getSingleRouteParam } from "@/lib/route-params";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function RecipeDetailRoute() {
  const params = useLocalSearchParams<{ uuid?: string | string[] }>();
  const uuid = getSingleRouteParam(params.uuid);

  if (!uuid) {
    return <Redirect href="/" />;
  }

  return <RecipeDetailScreen uuid={uuid} />;
}
