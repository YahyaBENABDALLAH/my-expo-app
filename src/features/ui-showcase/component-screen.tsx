import { useTranslation } from 'react-i18next';
import { PageScreen } from '@components/ui';
import SwitchScreen from './switch-screen';
import ButtonsScreen from './buttons-screen';
import BottomSheetScreen from './bottom-sheet-screen';
import InputScreen from './input-screen';
import CheckboxScreen from './checkbox-screen';
import SliderScreen from './slider-screen';
import PickerScreen from './picker-screen';
import SegmentsScreen from './segments-screen';
import CollapsibleScreen from './collapsible-screen';
import FieldGroupScreen from './field-group-screen';
import HostScreen from './host-screen';
import NativeScreen from './native-screen';
import TextScreen from './text-screen';
import SkeletonScreen from './skeleton-screen';
import ListScreen from './list-screen';
import TokensScreen from './tokens-screen';

const screens = {
  switch: SwitchScreen,
  buttons: ButtonsScreen,
  'bottom-sheet': BottomSheetScreen,
  input: InputScreen,
  checkbox: CheckboxScreen,
  slider: SliderScreen,
  picker: PickerScreen,
  segments: SegmentsScreen,
  collapsible: CollapsibleScreen,
  'field-group': FieldGroupScreen,
  host: HostScreen,
  native: NativeScreen,
  text: TextScreen,
  skeleton: SkeletonScreen,
  list: ListScreen,
  tokens: TokensScreen,
};

export function ComponentScreen({ name }: { name?: string }) {
  const { t } = useTranslation();
  const Screen =
    name && Object.hasOwn(screens, name) ? screens[name as keyof typeof screens] : undefined;
  return Screen ? (
    <Screen />
  ) : (
    <PageScreen
      title={t('showcase.unavailable')}
      description={t('showcase.choose')}
      actions={[{ label: t('tools.showcase'), testID: 'page-action-ui-showcase', href: '/ui' }]}
    />
  );
}
