import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { queryClient } from '@/lib/react-query';

export function AppQueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    focusManager.setFocused(AppState.currentState === 'active');
    const focus = AppState.addEventListener('change', (state) =>
      focusManager.setFocused(state === 'active'),
    );
    let active = true;
    let receivedEvent = false;
    const update = (state: Network.NetworkState) => {
      if (active)
        onlineManager.setOnline(state.isConnected !== false && state.isInternetReachable !== false);
    };
    const network = Network.addNetworkStateListener((state) => {
      receivedEvent = true;
      update(state);
    });
    void Network.getNetworkStateAsync()
      .then((state) => {
        if (!receivedEvent) update(state);
      })
      .catch(() => {});
    return () => {
      active = false;
      focus.remove();
      network.remove();
    };
  }, []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
