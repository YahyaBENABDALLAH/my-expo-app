import type { DeviceInfo, NetworkInfo } from "@/types/device.types";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { useCallback, useEffect, useState } from "react";

function getDeviceType(type: Device.DeviceType) {
  switch (type) {
    case Device.DeviceType.PHONE:
      return "Phone";
    case Device.DeviceType.TABLET:
      return "Tablet";
    case Device.DeviceType.DESKTOP:
      return "Desktop";
    case Device.DeviceType.TV:
      return "TV";
    default:
      return "Unknown";
  }
}

async function loadDeviceInfo() {
  const [deviceType, networkState, ipAddress] = await Promise.all([
    Device.getDeviceTypeAsync(),
    Network.getNetworkStateAsync(),
    Network.getIpAddressAsync(),
  ]);

  const deviceInfo: DeviceInfo = {
    brand: Device.brand,
    designName: Device.designName,
    deviceName: Device.deviceName,
    deviceType: getDeviceType(deviceType),
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    totalMemory: Device.totalMemory,
    isDevice: Device.isDevice,
  };
  const networkInfo: NetworkInfo = {
    ipAddress,
    networkType: networkState.type || "Unknown",
    isConnected: networkState.isConnected ?? false,
    isInternetReachable: networkState.isInternetReachable ?? false,
  };

  return { deviceInfo, networkInfo };
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadDeviceInfo();
      setDeviceInfo(result.deviceInfo);
      setNetworkInfo(result.networkInfo);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error("Unable to load device information"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    loadDeviceInfo()
      .then((result) => {
        if (isActive) {
          setDeviceInfo(result.deviceInfo);
          setNetworkInfo(result.networkInfo);
        }
      })
      .catch((cause: unknown) => {
        if (isActive) {
          setError(
            cause instanceof Error
              ? cause
              : new Error("Unable to load device information"),
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { deviceInfo, error, isLoading, networkInfo, refresh };
}
