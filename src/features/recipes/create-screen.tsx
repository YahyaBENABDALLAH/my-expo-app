import { translateValidationMessage } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Picker,
  UniversalButtonContent,
  UniversalTextContent as Text,
  RecipeStepper,
  PageScreen,
  NativeField,
  QueryContent,
} from '@components/ui';
import { router } from 'expo-router';

import { lookupLabel } from './queries';

import { useRecipeCreation } from './use-recipe-creation';

function ChefRequirement({
  chef,
  chefUuid,
  needsChef,
  canCreateChef,
}: Readonly<
  Pick<ReturnType<typeof useRecipeCreation>, 'chef' | 'chefUuid' | 'needsChef' | 'canCreateChef'>
>) {
  const { t } = useTranslation();
  if (chefUuid) return null;
  if (!needsChef) {
    return (
      <>
        <Text>{canCreateChef ? t('recipeForm.chefRequired') : t('recipeForm.loginChef')}</Text>
        <UniversalButtonContent
          variant="primary"
          disabled={!canCreateChef}
          label={t('chefProfile.heroTitle')}
          onPress={() => router.push('/become-chef')}
        />
      </>
    );
  }
  return (
    <QueryContent query={chef} disabledMessage={t('recipeForm.loadChef')}>
      {!chef.error && !chef.isFetching && chef.fetchStatus !== 'paused' ? (
        <>
          <Text>{t('recipeForm.chefRequired')}</Text>
          <UniversalButtonContent
            variant="primary"
            label={t('chefProfile.heroTitle')}
            onPress={() => router.push('/become-chef')}
          />
        </>
      ) : null}
    </QueryContent>
  );
}

export default function CreateScreen() {
  const { t } = useTranslation();
  const {
    focused,
    onRefresh,
    chef,
    needsChef,
    canCreateChef,
    chefUuid,
    draft,
    step,
    isFinalStep,
    isCurrentValid,
    continueDisabled,
    previousStep,
    error,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addStep,
    updateStep,
    removeStep,
    ingredientSearch,
    searchIngredients,
    lookupPage,
    setLookupPage,
    difficulties,
    cuisines,
    ingredients,
    units,
    mutation,
    advance,
    setField,
  } = useRecipeCreation();
  const continueLabel = isFinalStep ? t('recipeForm.publish') : t('auth.continue');
  return (
    <PageScreen
      title={t('common.createRecipe')}
      description={t('recipeForm.description')}
      tab
      onRefresh={onRefresh}
    >
      <RecipeStepper current={step} isCurrentValid={isCurrentValid} animate={focused} />
      <ChefRequirement
        chef={chef}
        chefUuid={chefUuid}
        needsChef={needsChef}
        canCreateChef={canCreateChef}
      />
      {error ? <Text testID="recipe-form-error">{translateValidationMessage(error)}</Text> : null}
      {step === 0 ? (
        <>
          <NativeField
            label={t('recipeForm.title')}
            testID="recipe-title"
            value={draft.title}
            onChange={(value) => setField('title', value)}
          />
          <NativeField
            label={t('recipeForm.summary')}
            testID="recipe-summary"
            value={draft.summary}
            onChange={(value) => setField('summary', value)}
            multiline
          />
        </>
      ) : null}
      {step === 1 ? (
        <>
          {(
            [
              ['difficultyUuid', t('common.difficulty'), difficulties],
              ['cuisineUuid', t('common.cuisine'), cuisines],
            ] as const
          ).map(([key, label, query]) => (
            <Column key={key} spacing={8}>
              <Text>{label}</Text>
              <QueryContent query={query}>
                <Picker
                  selectedValue={draft[key]}
                  onValueChange={(value) => setField(key, String(value))}
                >
                  <Picker.Item label={t('common.select')} value="" />
                  {query.data?.data.map((item) => (
                    <Picker.Item key={item.uuid} value={item.uuid} label={lookupLabel(item)} />
                  ))}
                </Picker>
              </QueryContent>
            </Column>
          ))}
          {(
            [
              ['prepTimeMinutes', 'recipeForm.preparation'],
              ['cookTimeMinutes', 'recipeForm.cooking'],
              ['servings', 'recipeForm.servings'],
            ] as const
          ).map(([key, label]) => (
            <NativeField
              key={key}
              label={t(label)}
              testID={`recipe-${key}`}
              value={draft[key]}
              numeric
              onChange={(value) => setField(key, value)}
            />
          ))}
        </>
      ) : null}
      {step === 2 ? (
        <>
          <NativeField
            label={t('recipeForm.findIngredients')}
            testID="ingredient-search"
            value={ingredientSearch}
            onChange={searchIngredients}
          />
          <QueryContent query={ingredients}>
            <Text>
              {t('recipeForm.ingredientPage', {
                count: ingredients.data?.data.length ?? 0,
                page: lookupPage,
              })}
            </Text>
          </QueryContent>
          <UniversalButtonContent
            variant="secondary"
            label={t('recipeForm.previousIngredients')}
            disabled={lookupPage === 1}
            onPress={() => setLookupPage(lookupPage - 1)}
          />
          <UniversalButtonContent
            variant="secondary"
            label={t('recipeForm.nextIngredients')}
            disabled={!ingredients.data?.meta.hasNextPage}
            onPress={() => setLookupPage(lookupPage + 1)}
          />
          {draft.ingredients.map((item, index) => (
            <Column key={item.id} spacing={8}>
              <Text>{t('recipeForm.ingredientNumber', { index: index + 1 })}</Text>
              <Picker
                selectedValue={item.ingredientUuid}
                onValueChange={(value) =>
                  updateIngredient(item.id, { ingredientUuid: String(value) })
                }
              >
                <Picker.Item value="" label={t('recipeForm.selectIngredient')} />
                {item.ingredientUuid &&
                !ingredients.data?.data.some((option) => option.uuid === item.ingredientUuid) ? (
                  <Picker.Item
                    value={item.ingredientUuid}
                    label={t('recipeForm.selectedIngredient')}
                  />
                ) : null}
                {ingredients.data?.data.map((option) => (
                  <Picker.Item key={option.uuid} value={option.uuid} label={lookupLabel(option)} />
                ))}
              </Picker>
              <NativeField
                label={t('recipeForm.quantity')}
                numeric
                testID={`ingredient-${item.id}-quantity`}
                value={item.quantity}
                onChange={(value) => updateIngredient(item.id, { quantity: value })}
              />
              <QueryContent query={units}>
                <Picker
                  selectedValue={item.unitUuid}
                  onValueChange={(value) => updateIngredient(item.id, { unitUuid: String(value) })}
                >
                  <Picker.Item value="" label={t('recipeForm.noUnit')} />
                  {units.data?.data.map((option) => (
                    <Picker.Item
                      key={option.uuid}
                      value={option.uuid}
                      label={lookupLabel(option)}
                    />
                  ))}
                </Picker>
              </QueryContent>
              <UniversalButtonContent
                variant="destructive"
                label={t('recipeForm.removeIngredient')}
                onPress={() => removeIngredient(item.id)}
              />
            </Column>
          ))}
          <UniversalButtonContent
            variant="secondary"
            label={t('recipeForm.addIngredient')}
            testID="recipe-add-ingredient"
            onPress={addIngredient}
          />
        </>
      ) : null}
      {step === 3 ? (
        <>
          {draft.steps.map((item, index) => (
            <Column key={item.id} spacing={8}>
              <NativeField
                label={t('recipeForm.stepNumber', { index: index + 1 })}
                multiline
                testID={`recipe-instruction-${item.id}`}
                value={item.instruction}
                onChange={(value) => updateStep(item.id, value)}
              />
              <UniversalButtonContent
                variant="destructive"
                label={t('recipeForm.removeStep')}
                onPress={() => removeStep(item.id)}
              />
            </Column>
          ))}
          <UniversalButtonContent
            variant="secondary"
            label={t('recipeForm.addStep')}
            testID="recipe-add-step"
            onPress={addStep}
          />
        </>
      ) : null}
      <UniversalButtonContent
        variant="secondary"
        label={t('recipeForm.previousStep')}
        disabled={step === 0 || mutation.isPending}
        onPress={previousStep}
      />
      <UniversalButtonContent
        variant={isFinalStep ? 'success' : 'primary'}
        label={mutation.isPending ? t('recipeForm.publishing') : continueLabel}
        testID="recipe-continue"
        onPress={advance}
        disabled={continueDisabled}
      />
      {mutation.error ? (
        <Text testID="recipe-publish-error">{t('recipeForm.publishFailed')}</Text>
      ) : null}
    </PageScreen>
  );
}
