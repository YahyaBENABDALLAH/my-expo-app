import { Column } from '@expo/ui';
import { UniversalButtonContent } from '../button/universal-button-content';
import { router, type Href } from 'expo-router';
import { KeyboardAvoidingView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UniversalHost } from '../host/universal-host';
import { RefreshableScrollView } from '../refreshable-scroll-view/refreshable-scroll-view';
import { nativeFillWidth } from '../native/native-fill-width';
import { PageFrame } from './page-frame';
import { UniversalTextContent } from '../text/universal-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ReactNode } from 'react';
import { screenInsets } from '@/lib/screen-insets';

export function PageScreen({
  title,
  description,
  actions = [],
  children,
  tab = false,
  onRefresh,
  colorScheme,
  onBack,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  tab?: boolean;
  onRefresh?: () => Promise<void>;
  colorScheme?: 'light' | 'dark';
  onBack?: () => void;
  actions?: { label: string; href: Href; testID?: string }[];
}) {
  const scheme = useColorScheme(colorScheme);
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <PageFrame title={title} onBack={tab ? undefined : goBack} colorScheme={scheme}>
      <PageContent
        description={description}
        actions={actions}
        tab={tab}
        onRefresh={onRefresh}
        colorScheme={scheme}
      >
        {children}
      </PageContent>
    </PageFrame>
  );
}

function PageContent({
  description,
  actions,
  children,
  tab,
  onRefresh,
  colorScheme: scheme,
}: {
  description: string;
  actions: { label: string; href: Href; testID?: string }[];
  children?: ReactNode;
  tab: boolean;
  onRefresh?: () => Promise<void>;
  colorScheme: 'light' | 'dark';
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        ...screenInsets(insets, { tabBarShown: tab }),
      }}
    >
      {/* Keep system insets outside the keyboard padding so neither overwrites the other. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1 }}
        >
          <RefreshableScrollView onRefresh={onRefresh} testID="page-scroll">
            <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
              <UniversalTextContent>{description}</UniversalTextContent>
              {children}
              {actions.map(({ label, href, testID }) => (
                <UniversalButtonContent
                  key={testID ?? (typeof href === 'string' ? href : JSON.stringify(href))}
                  label={label}
                  variant="secondary"
                  testID={
                    testID ??
                    `page-action-${(typeof href === 'string' ? href : href.pathname).replaceAll(/[^a-zA-Z0-9]+/g, '-').replaceAll(/^-|-$/g, '')}`
                  }
                  onPress={() => router.push(href)}
                />
              ))}
            </Column>
          </RefreshableScrollView>
        </UniversalHost>
      </KeyboardAvoidingView>
    </View>
  );
}
