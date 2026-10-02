import { AUTH_STATUS } from "@/constants/auth.constant";
import { useAuthContext } from "@/context/auth.context";
import { setPendingAuthenticatedHref } from "@/lib/pending-navigation";
import { resolveNotificationDestination } from "@/services/notifications/notification-routing";
import * as Notifications from "expo-notifications";
import { router, useRootNavigationState } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

interface QueuedNotification {
  destination: NonNullable<
    ReturnType<typeof resolveNotificationDestination>
  >;
}

function getResponseId(response: Notifications.NotificationResponse) {
  return `${response.notification.request.identifier}:${response.actionIdentifier}`;
}

export function NotificationCoordinator() {
  if (Platform.OS === "web") {
    return null;
  }

  return <NativeNotificationCoordinator />;
}

function NativeNotificationCoordinator() {
  const { status } = useAuthContext();
  const rootNavigationState = useRootNavigationState();
  const handledResponseIds = useRef(new Set<string>());
  const isProcessing = useRef(false);
  const queue = useRef<QueuedNotification[]>([]);
  const authStatus = useRef(status);
  const isRouterReady = useRef(Boolean(rootNavigationState?.key));

  const processQueue = useCallback(() => {
    const next = queue.current[0];
    if (
      !next ||
      isProcessing.current ||
      !isRouterReady.current ||
      authStatus.current === AUTH_STATUS.UNKNOWN
    ) {
      return;
    }

    isProcessing.current = true;

    if (
      next.destination.requiresAuth &&
      authStatus.current !== AUTH_STATUS.AUTHENTICATED
    ) {
      setPendingAuthenticatedHref(next.destination.href);
      queue.current = [];
      Notifications.clearLastNotificationResponse();
      router.replace("/(auth)");
      isProcessing.current = false;
      return;
    }

    queue.current.shift();
    router.push(next.destination.href);
    Notifications.clearLastNotificationResponse();
    isProcessing.current = false;
  }, []);

  const enqueueResponse = useCallback(
    (response: Notifications.NotificationResponse | null) => {
      if (
        !response
      ) {
        return;
      }

      if (
        response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        Notifications.clearLastNotificationResponse();
        return;
      }

      const destination = resolveNotificationDestination(
        response.notification.request.content.data,
      );

      if (!destination) {
        Notifications.clearLastNotificationResponse();
        return;
      }

      const responseId = destination.notificationId ?? getResponseId(response);
      if (handledResponseIds.current.has(responseId)) {
        return;
      }

      handledResponseIds.current.add(responseId);
      queue.current = [{ destination }];
      processQueue();
    },
    [processQueue],
  );

  useEffect(() => {
    enqueueResponse(Notifications.getLastNotificationResponse());

    const subscription =
      Notifications.addNotificationResponseReceivedListener(enqueueResponse);

    return () => subscription.remove();
  }, [enqueueResponse]);

  useEffect(() => {
    authStatus.current = status;
    isRouterReady.current = Boolean(rootNavigationState?.key);
    processQueue();
  }, [processQueue, rootNavigationState?.key, status]);

  return null;
}

export function configureNotificationHandling() {
  if (Platform.OS === "web") {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
