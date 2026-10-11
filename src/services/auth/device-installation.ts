import * as Device from 'expo-device';
import { randomUUID } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { DeviceMetadata } from '@/types/auth.types';

const DEVICE_INSTALLATION_ID_KEY = 'auth.deviceInstallationId';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let installationIdPromise: Promise<string> | undefined;

async function loadOrCreateLocalInstallationId() {
  const storedId = await SecureStore.getItemAsync(DEVICE_INSTALLATION_ID_KEY);

  if (storedId && UUID_PATTERN.test(storedId)) {
    return storedId;
  }

  const installationId = randomUUID();
  await SecureStore.setItemAsync(DEVICE_INSTALLATION_ID_KEY, installationId);
  return installationId;
}

export function getDeviceInstallationId() {
  installationIdPromise ??= loadOrCreateLocalInstallationId().catch((error) => {
    installationIdPromise = undefined;
    throw error;
  });
  return installationIdPromise;
}

export async function getDeviceMetadata(): Promise<DeviceMetadata> {
  return {
    deviceInstallationId: await getDeviceInstallationId(),
    platform: Platform.OS,
    deviceName: Device.deviceName ?? undefined,
    osVersion: Device.osVersion ?? undefined,
    appVersion: Constants.expoConfig?.version,
  };
}
