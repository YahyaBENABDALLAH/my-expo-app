import { translateValidationMessage } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import {
  UniversalButtonContent,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
  TextInput,
} from '@components/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthContext } from '@/context/auth.context';

import { useCreateChefProfileMutation } from '@/services/chef-profile/chef-profile.hooks';
import { chefProfileSchema as schema } from './chef-profile';

export default function BecomeChefScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [name, setName] = useState([user?.firstName, user?.lastName].filter(Boolean).join(' '));
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [validation, setValidation] = useState('');
  const mutation = useCreateChefProfileMutation({
    onSuccess: () => router.navigate('/create-recipe'),
  });
  return (
    <PageScreen title={t('chefProfile.heroTitle')} description={t('chef.description')}>
      <PageSection>
        {user?.chefProfileUuid ? (
          <Text>{t('chef.ready')}</Text>
        ) : (
          <>
            <TextInput
              label={t('chefProfile.displayName')}
              testID="chef-display-name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              label={t('chefProfile.bio')}
              multiline
              testID="chef-bio"
              value={bio}
              onChangeText={setBio}
            />
            <TextInput
              label={t('chefProfile.specialty')}
              testID="chef-specialty"
              value={specialty}
              onChangeText={setSpecialty}
            />
            {validation ? <Text>{translateValidationMessage(validation)}</Text> : null}
            {!user?.uuid ? <Text>{t('chef.login')}</Text> : null}
            {mutation.error ? <Text>{t('chef.failed')}</Text> : null}
            <UniversalButtonContent
              variant="primary"
              label={mutation.isPending ? t('chefProfile.submitting') : t('chefProfile.submit')}
              disabled={!user?.uuid || mutation.isPending}
              onPress={() => {
                const result = schema.safeParse({ displayName: name, bio, specialty });
                if (!result.success) {
                  setValidation(result.error.issues.map((issue) => issue.message).join('\n'));
                  return;
                }
                setValidation('');
                mutation.mutate(result.data);
              }}
            />
          </>
        )}
      </PageSection>
    </PageScreen>
  );
}
