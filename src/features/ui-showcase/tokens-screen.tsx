import { useTranslation } from 'react-i18next';
import {
  Column,
  PageScreen,
  Row,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { useAppTheme } from '@/hooks/use-theme';
import { themes } from '@/constants/themes/index';

export default function TokensScreen() {
  const { t } = useTranslation();
  const { colors, themeId, scheme } = useAppTheme();
  return (
    <PageScreen
      title={t('showcase.tokens')}
      description={t('showcase.tokenDescription', {
        theme: themes[themeId].label,
        mode: t(`appearance.${scheme}`),
      })}
    >
      {Object.entries(colors).map(([role, value]) => (
        <Row key={role} spacing={12} alignment="center" modifiers={nativeFillWidth}>
          <Column
            style={{
              width: 28,
              height: 28,
              backgroundColor: value,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 6,
            }}
          />
          <Column spacing={2} modifiers={nativeRowWeight}>
            <Text>{role}</Text>
            <Text variant="caption">{value}</Text>
          </Column>
        </Row>
      ))}
    </PageScreen>
  );
}
