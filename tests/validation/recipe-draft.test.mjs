import assert from 'node:assert/strict';
import test from 'node:test';
import {
  recipeBody,
  recipeDraftSchema,
  recipeStepSchemas,
} from '../../src/features/recipes/recipe-draft.ts';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const draft = {
  title: '  Tagine  ',
  summary: ' Slow cooked ',
  difficultyUuid: uuid,
  cuisineUuid: '',
  prepTimeMinutes: '15',
  cookTimeMinutes: '45',
  servings: '5',
  ingredients: [{ id: 20, ingredientUuid: uuid, quantity: '1.5', unitUuid: '' }],
  steps: [{ id: 30, instruction: '  Simmer until tender.  ' }],
};

test('recipe payload normalizes numbers and optional IDs and excludes client row IDs', () => {
  const body = recipeBody(draft);
  assert.equal(body.title, 'Tagine');
  assert.equal(body.summary, 'Slow cooked');
  assert.equal(body.prepTimeMinutes, 15);
  assert.equal(body.servings, 5);
  assert.equal(body.cuisineUuid, null);
  assert.deepEqual(body.ingredients, [
    { ingredientUuid: uuid, quantity: 1.5, unitUuid: null, sortOrder: 0, isOptional: false },
  ]);
  assert.deepEqual(body.steps, [{ instruction: 'Simmer until tender.', stepNumber: 1 }]);
});

test('recipe steps can be validated independently without requiring later fields', () => {
  assert.equal(recipeStepSchemas[0].safeParse({ title: 'Soup', summary: '' }).success, true);
  assert.equal(recipeStepSchemas[2].safeParse({ ingredients: [] }).success, false);
  assert.equal(recipeStepSchemas[3].safeParse({ steps: [] }).success, false);
});

test('recipes reject blank titles and instructions and malformed lookup IDs', () => {
  for (const change of [
    { title: ' ' },
    { difficultyUuid: 'missing' },
    { cuisineUuid: 'bad' },
    { ingredients: [{ ...draft.ingredients[0], ingredientUuid: '' }] },
    { steps: [{ instruction: ' ' }] },
  ]) {
    assert.equal(
      recipeDraftSchema.safeParse({ ...draft, ...change }).success,
      false,
      JSON.stringify(change),
    );
  }
});

test('recipe numbers reject nonfinite values, fractional servings, negative times and nonpositive quantities', () => {
  for (const change of [
    { servings: '1.5' },
    { servings: '0' },
    { servings: '101' },
    { prepTimeMinutes: '-1' },
    { cookTimeMinutes: '1441' },
    { cookTimeMinutes: 'Infinity' },
    { ingredients: [{ ...draft.ingredients[0], quantity: '' }] },
    { ingredients: [{ ...draft.ingredients[0], quantity: 'NaN' }] },
  ]) {
    assert.equal(
      recipeDraftSchema.safeParse({ ...draft, ...change }).success,
      false,
      JSON.stringify(change),
    );
  }
});

test('removing or reordering steps always produces consecutive server step numbers', () => {
  const body = recipeBody({
    ...draft,
    steps: [
      { id: 99, instruction: 'Chop.' },
      { id: 2, instruction: 'Cook.' },
    ],
  });
  assert.deepEqual(
    body.steps.map((step) => step.stepNumber),
    [1, 2],
  );
  assert.deepEqual(
    body.steps.map((step) => step.instruction),
    ['Chop.', 'Cook.'],
  );
});
