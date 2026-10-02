import { useRecipeListQuery } from "@/services/recipe/recipe.queries";
import { useMemo } from "react";

/**
 * The current API exposes only the public recipe list, without a chef filter.
 * Keep the client-side fallback isolated here until the backend adds one.
 */
export function useMyRecipes(chefUuid?: string | null) {
  const normalizedChefUuid = chefUuid?.trim() || undefined;
  const query = useRecipeListQuery(
    { pageSize: 100 },
    { enabled: Boolean(normalizedChefUuid) },
  );
  const recipes = useMemo(
    () =>
      normalizedChefUuid
        ? (query.data?.data ?? []).filter(
            (recipe) => recipe.chefUuid === normalizedChefUuid,
          )
        : [],
    [normalizedChefUuid, query.data?.data],
  );

  return { ...query, recipes };
}
