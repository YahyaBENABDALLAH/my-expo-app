import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import {
  Column,
  ListItem,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';

export default function ListScreen() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('common.none');
  return (
    <PageScreen title={t('showcase.list')} description={t('showcase.listDescription')}>
      <PageSection>
        <Column spacing={spacing.sm}>
          {['common.recipes', 'common.favoritesOnly', 'common.recipeHistory'].map((label) => (
            <ListItem
              key={t(label)}
              supportingText={t('showcase.open', { label: t(label) })}
              onPress={() => setSelected(label)}
            >
              {t(label)}
            </ListItem>
          ))}
        </Column>
        <Text testID="demo-list-selection">
          {t('common.selectedValue', { value: t(selected) })}
        </Text>
      </PageSection>
    </PageScreen>
  );
}
