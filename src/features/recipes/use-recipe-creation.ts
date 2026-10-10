import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/context/auth.context';
import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useTabActions } from '@/features/pages/tab-actions';
import { chefProfileOptions, lookupOptions } from './queries';
import { createRecipeOptions } from './mutations';
import {
  emptyRecipeDraft,
  recipeBody,
  recipeDraftSchema,
  recipeStepSchemas,
  type RecipeDraft,
} from './recipe-draft';

export function useRecipeCreation() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const focused = useIsFocused();
  const { setAction } = useTabActions();
  const client = useQueryClient();
  const chefOptions = chefProfileOptions(user?.uuid ?? '');
  const needsChef = Boolean(user?.isChef && !user.chefProfileUuid);
  const chef = useQuery({ ...chefOptions, enabled: focused && needsChef });
  const chefUuid = user?.chefProfileUuid ?? chef.data?.uuid;
  const [draft, setDraft] = useState<RecipeDraft>(emptyRecipeDraft);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const nextId = useRef(0);
  const submitting = useRef(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [lookupPage, setLookupPage] = useState(1);
  const difficultyOptions = lookupOptions('Difficulty');
  const cuisineOptions = lookupOptions('Cuisine');
  const ingredientOptions = lookupOptions('Ingredient', lookupPage, ingredientSearch);
  const unitOptions = lookupOptions('Unit');
  const difficulties = useQuery({ ...difficultyOptions, enabled: focused && step === 1 });
  const cuisines = useQuery({ ...cuisineOptions, enabled: focused && step === 1 });
  const ingredients = useQuery({ ...ingredientOptions, enabled: focused && step === 2 });
  const units = useQuery({ ...unitOptions, enabled: focused && step === 2 });
  const refresh = useScreenRefresh([
    ...(needsChef ? [chefOptions.queryKey] : []),
    ...(step === 1 ? [difficultyOptions.queryKey, cuisineOptions.queryKey] : []),
    ...(step === 2 ? [ingredientOptions.queryKey, unitOptions.queryKey] : []),
  ]);
  const publishOptions = createRecipeOptions(client, chefUuid ?? '');
  const mutation = useMutation({
    ...publishOptions,
    onSuccess: async (recipe, body, result, context) => {
      await publishOptions.onSuccess?.(recipe, body, result, context);
      setDraft(emptyRecipeDraft);
      setStep(0);
      router.push({ pathname: '/recipe/[uuid]', params: { uuid: recipe.uuid } });
    },
    onSettled: () => {
      submitting.current = false;
    },
  });
  const { mutate } = mutation;
  const advance = useCallback(() => {
    if (submitting.current) return;
    const result = (step === 3 ? recipeDraftSchema : recipeStepSchemas[step]).safeParse(draft);
    if (!result.success) {
      setError(result.error.issues.map((issue) => issue.message).join('\n'));
      return;
    }
    setError('');
    if (step < 3) setStep(step + 1);
    else {
      submitting.current = true;
      mutate(recipeBody(draft));
    }
  }, [draft, step, mutate]);
  useEffect(() => {
    setAction('create-recipe', {
      kind: step === 3 ? 'submit' : 'continue',
      label: mutation.isPending
        ? t('recipeForm.publishing')
        : step === 3
          ? t('recipeForm.submit')
          : t('recipeForm.continue'),
      onPress: advance,
      disabled: mutation.isPending || (step === 3 && !chefUuid),
    });
    return () => setAction('create-recipe', undefined);
  }, [advance, mutation.isPending, setAction, step, chefUuid, t]);
  const setField = (key: Exclude<keyof RecipeDraft, 'ingredients' | 'steps'>, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const addIngredient = () => {
    const id = nextId.current++;
    setDraft((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        { id, ingredientUuid: '', quantity: '1', unitUuid: '' },
      ],
    }));
  };
  const addStep = () => {
    const id = nextId.current++;
    setDraft((current) => ({ ...current, steps: [...current.steps, { id, instruction: '' }] }));
  };
  return {
    focused,
    onRefresh: focused && (needsChef || step === 1 || step === 2) ? refresh : undefined,
    chef,
    needsChef,
    canCreateChef: Boolean(user?.uuid),
    chefUuid,
    draft,
    setDraft,
    step,
    setStep,
    error,
    setError,
    addIngredient,
    addStep,
    ingredientSearch,
    setIngredientSearch,
    lookupPage,
    setLookupPage,
    difficulties,
    cuisines,
    ingredients,
    units,
    mutation,
    advance,
    setField,
  };
}
