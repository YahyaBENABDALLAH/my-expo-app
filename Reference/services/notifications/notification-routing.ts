import type { Href } from "expo-router";
import { z } from "zod";

const VERSION_SCHEMA = z.union([z.literal(1), z.literal("1")]);
const IDENTIFIER_SCHEMA = z.string().trim().min(1).max(128);
const OPTIONAL_IDENTIFIER_SCHEMA = IDENTIFIER_SCHEMA.optional();

const notificationIntentSchema = z.discriminatedUnion("target", [
  z.object({
    notificationId: OPTIONAL_IDENTIFIER_SCHEMA,
    target: z.literal("home"),
    version: VERSION_SCHEMA,
  }),
  z.object({
    notificationId: OPTIONAL_IDENTIFIER_SCHEMA,
    target: z.literal("recipe"),
    targetId: IDENTIFIER_SCHEMA,
    version: VERSION_SCHEMA,
  }),
  z.object({
    notificationId: OPTIONAL_IDENTIFIER_SCHEMA,
    target: z.literal("category"),
    targetId: IDENTIFIER_SCHEMA,
    version: VERSION_SCHEMA,
  }),
  z.object({
    categoryUuid: OPTIONAL_IDENTIFIER_SCHEMA,
    cuisineUuid: OPTIONAL_IDENTIFIER_SCHEMA,
    difficultyUuid: OPTIONAL_IDENTIFIER_SCHEMA,
    notificationId: OPTIONAL_IDENTIFIER_SCHEMA,
    query: z.string().trim().max(120).optional(),
    target: z.literal("search"),
    version: VERSION_SCHEMA,
  }),
  z.object({
    notificationId: OPTIONAL_IDENTIFIER_SCHEMA,
    tab: z.enum(["liked", "favorite"]).optional(),
    target: z.literal("liked-favorites"),
    version: VERSION_SCHEMA,
  }),
]);

export interface NotificationDestination {
  href: Href;
  notificationId?: string;
  requiresAuth: boolean;
}

function definedParams(values: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export function resolveNotificationDestination(
  data: unknown,
): NotificationDestination | null {
  const parsed = notificationIntentSchema.safeParse(data);

  if (!parsed.success) {
    if (__DEV__) {
      console.warn("[notifications] Ignored invalid navigation payload.");
    }
    return null;
  }

  const intent = parsed.data;
  let href: Href;

  switch (intent.target) {
    case "home":
      href = "/(tabs)";
      break;
    case "recipe":
      href = {
        pathname: "/recipe/[uuid]",
        params: { uuid: intent.targetId },
      };
      break;
    case "category":
      href = {
        pathname: "/category/[uuid]",
        params: { uuid: intent.targetId },
      };
      break;
    case "search":
      href = {
        pathname: "/(tabs)/search",
        params: definedParams({
          categoryUuid: intent.categoryUuid,
          cuisineUuid: intent.cuisineUuid,
          difficultyUuid: intent.difficultyUuid,
          q: intent.query,
        }),
      };
      break;
    case "liked-favorites":
      href = {
        pathname: "/my-recipes/liked-favorites",
        params: definedParams({ tab: intent.tab }),
      };
      break;
  }

  return {
    href,
    notificationId: intent.notificationId,
    requiresAuth: true,
  };
}

export type NotificationIntent = z.infer<typeof notificationIntentSchema>;
