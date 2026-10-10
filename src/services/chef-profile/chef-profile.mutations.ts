import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { chefProfileKeys, recipeKeys } from '@/lib/api-query-keys';
import type {
  CreateChefProfilePayload,
  UpdateChefProfilePayload,
  ChefProfileItem,
} from '@/types/chef-profile.types';
import { updateAuthUser } from '../auth/auth.session';
import { sessionMutationOptions } from '../session-mutation';
import { chefProfileService } from './chef-profile.service';

export type UpdateChefProfileVariables = { uuid: string; body: UpdateChefProfilePayload };

async function maintainChefProfile(
  client: QueryClient,
  profile: ChefProfileItem,
  assertCurrent: () => void,
) {
  const queryKey = chefProfileKeys.detail(profile.uuid);
  await client.cancelQueries({ queryKey, exact: true });
  assertCurrent();
  client.setQueryData(queryKey, profile);
  await Promise.all([
    client.invalidateQueries({ queryKey: chefProfileKeys.lists }),
    client.invalidateQueries({ queryKey: chefProfileKeys.infiniteLists }),
    client.invalidateQueries({ queryKey: recipeKeys.chef(profile.userUuid), exact: true }),
    client.invalidateQueries({ queryKey: recipeKeys.all }),
  ]);
}

export function createChefProfileMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    chefProfileKeys.mutation('create-self'),
    async (body: CreateChefProfilePayload, version) => {
      const profile = await chefProfileService.createSelf(body);
      await updateAuthUser(
        { isChef: true, chefProfileUuid: z.uuid().parse(profile.uuid) },
        version,
      );
      return profile;
    },
    (profile, _variables, assertCurrent) => maintainChefProfile(client, profile, assertCurrent),
  );
}

export function updateChefProfileMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    chefProfileKeys.mutation('update'),
    ({ uuid, body }: UpdateChefProfileVariables) => chefProfileService.update(uuid, body),
    (profile, _variables, assertCurrent) => maintainChefProfile(client, profile, assertCurrent),
  );
}

export function toggleChefProfileVerifiedMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    chefProfileKeys.mutation('toggle-verified'),
    (uuid: string) => chefProfileService.toggleVerified(uuid),
    (profile, _variables, assertCurrent) => maintainChefProfile(client, profile, assertCurrent),
  );
}
