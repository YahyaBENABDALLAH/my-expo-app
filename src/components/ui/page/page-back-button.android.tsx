import { useTranslation } from 'react-i18next';
import { Icon, IconButton } from '@expo/ui/jetpack-compose';
import { semantics, size, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { PageBackButtonProps } from './page-back-button.types';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import { useHostLayoutDirection } from '../host/universal-host';

export function PageBackButton({ color, onPress }: PageBackButtonProps) {
  const { t } = useTranslation();
  const direction = useHostLayoutDirection();
  return (
    <IconButton
      onClick={onPress}
      modifiers={[
        size(PAGE_HEADER_MIN_HEIGHT, PAGE_HEADER_MIN_HEIGHT),
        semantics({ contentDescription: t('common.goBack') }),
        testID('page-back'),
      ]}
    >
      {/* SDK 57's XML loader does not read autoMirrored. Select the physical arrow explicitly. */}
      <Icon
        source={
          direction === 'rightToLeft'
            ? require('@expo/material-symbols/arrow_forward.xml')
            : require('@expo/material-symbols/arrow_back.xml')
        }
        size={24}
        tint={color}
      />
    </IconButton>
  );
}
