import { useAlert } from "@/components/ui/alert";
import * as Network from "expo-network";
import { useEffect, useRef } from "react";

export function DeviceStatusListener() {
  const { success, error } = useAlert();
  const lastNetworkState = useRef<boolean | null>(null);

  useEffect(() => {
    Network.getNetworkStateAsync().then((state) => {
      lastNetworkState.current = state.isConnected ?? null;
    });

    const subscription = Network.addNetworkStateListener((state) => {
      const connected = state.isConnected ?? null;

      if (connected === lastNetworkState.current) {
        return;
      }

      lastNetworkState.current = connected;

      if (connected === true) {
        success("Connected", "Your device is now online");
      } else if (connected === false) {
        error("Disconnected", "Your device is now offline");
      }
    });

    return () => subscription.remove();
  }, [success, error]);

  return null;
}
