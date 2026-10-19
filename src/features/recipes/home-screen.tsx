import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Column,
  nativeFillWidth,
  PageFrame,
  ScrollView,
  UniversalHost,
  usePageHeaderInset,
} from '@components/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import { HomeCatalogSections } from './home-catalog-sections';

export default function HomeScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  return (
    <PageFrame title={t('common.home')} colorScheme={scheme} headerBlur>
      <HomeContent colorScheme={scheme} />
    </PageFrame>
  );
}

function HomeContent({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(colorScheme);
  const headerInset = usePageHeaderInset();
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{
        flex: 1,
        backgroundColor: colors.background,
        ...screenInsets(insets, { tabBarShown: true }),
      }}
    >
      <ScrollView direction="vertical" showsIndicators={false} testID="page-scroll">
        <Column modifiers={nativeFillWidth} style={{ paddingTop: headerInset }}>
          <HomeCatalogSections />
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}
