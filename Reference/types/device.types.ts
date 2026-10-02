export interface DeviceInfo {
  brand: string | null;
  designName: string | null;
  deviceName: string | null;
  deviceType: string;
  modelName: string | null;
  osName: string | null;
  osVersion: string | null;
  totalMemory: number | null;
  isDevice: boolean;
}

export interface NetworkInfo {
  ipAddress: string | null;
  networkType: string;
  isConnected: boolean;
  isInternetReachable: boolean;
}
