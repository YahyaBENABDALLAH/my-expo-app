import { useTranslation } from 'react-i18next';
import { Button, Image } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  buttonStyle,
  contentShape,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { PageBackButtonProps } from './page-back-button.types';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';

export function PageBackButton({ color, onPress }: PageBackButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      testID="page-back"
      onPress={onPress}
      modifiers={[buttonStyle('plain'), accessibilityLabel(t('common.goBack'))]}
    >
      <Image
        systemName="arrow.backward"
        size={24}
        color={color}
        modifiers={[
          frame({ width: PAGE_HEADER_MIN_HEIGHT, height: PAGE_HEADER_MIN_HEIGHT }),
          contentShape(shapes.rectangle()),
        ]}
      />
    </Button>
  );
}
