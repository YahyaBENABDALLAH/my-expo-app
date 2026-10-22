import { useTranslation } from 'react-i18next';
import {
  Collapsible,
  Column,
  PageScreen,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { useState } from 'react';
import { spacing } from '@/constants/layout';
import { DemoSection } from './demo-section';

export default function CollapsibleScreen() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [expanded, setExpanded] = useState<'ingredients' | 'tips' | null>(null);
  return (
    <PageScreen
      title={t('showcase.collapsible')}
      description={t('showcase.collapsibleDescription')}
    >
      <DemoSection
        title={t('showcase.gallery.disclosure')}
        hint={t('showcase.gallery.disclosureHint')}
      >
        <Collapsible label={t('common.details')} isOpen={open} onOpenChange={setOpen}>
          <Column spacing={spacing.md} modifiers={nativeFillWidth}>
            <Text>{t('showcase.expanded')}</Text>
            <TextInput
              label={t('showcase.draft')}
              value={draft}
              onChangeText={setDraft}
              testID="demo-collapsible-draft"
            />
          </Column>
        </Collapsible>
        <Text testID="demo-collapsible-state">
          {t(open ? 'showcase.gallery.expanded' : 'showcase.gallery.collapsed')}
        </Text>
        <UniversalButtonContent
          variant="secondary"
          label={t(open ? 'showcase.gallery.collapse' : 'showcase.gallery.expand')}
          onPress={() => setOpen((current) => !current)}
          testID="demo-collapsible-toggle"
        />
      </DemoSection>
      <DemoSection
        title={t('showcase.gallery.accordion')}
        hint={t('showcase.gallery.accordionHint')}
      >
        <Collapsible
          label={t('common.ingredients')}
          isOpen={expanded === 'ingredients'}
          onOpenChange={(next) => setExpanded(next ? 'ingredients' : null)}
        >
          <Text>{t('examples.saladDetail')}</Text>
        </Collapsible>
        <Collapsible
          label={t('showcase.gallery.cookingTips')}
          isOpen={expanded === 'tips'}
          onOpenChange={(next) => setExpanded(next ? 'tips' : null)}
        >
          <Text>{t('examples.tip1')}</Text>
        </Collapsible>
        <UniversalButtonContent
          variant="tertiary"
          label={t('showcase.gallery.collapseAll')}
          onPress={() => {
            setOpen(false);
            setExpanded(null);
          }}
          testID="demo-collapsible-collapse-all"
        />
      </DemoSection>
    </PageScreen>
  );
}
