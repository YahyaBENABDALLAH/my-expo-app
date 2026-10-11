import assert from 'node:assert/strict';
import test from 'node:test';
import { createSourceLoader } from '../helpers/load-source.mjs';

function setup() {
  const load = createSourceLoader();
  return { load, toasts: load('lib/toasts.ts') };
}

test('success, warning and API error feedback share one queue and ignore stale dismissals', () => {
  const { load, toasts } = setup();
  const { reportErrorToast } = load('lib/error-toasts.ts');
  const { ApiError } = load('services/api.error.ts');
  let notifications = 0;
  const unsubscribe = toasts.subscribeToasts(() => notifications++);

  toasts.showToast({ variant: 'success', message: 'Recipe saved.' });
  const success = toasts.getToast();
  toasts.showToast({ variant: 'warning', message: 'Your draft is unsaved.' });
  reportErrorToast(new ApiError('HTTP 403', 403, null, 'You cannot edit this recipe.'));
  assert.equal(toasts.getToast(), success);
  assert.equal(success.variant, 'success');
  assert.equal(notifications, 3);

  toasts.dismissToast(success.id);
  const warning = toasts.getToast();
  assert.equal(warning.variant, 'warning');
  assert.equal(warning.message, 'Your draft is unsaved.');
  toasts.dismissToast(success.id);
  assert.equal(toasts.getToast(), warning);
  assert.equal(notifications, 4);
  toasts.dismissToast(warning.id);
  const error = toasts.getToast();
  assert.equal(error.variant, 'error');
  assert.equal(error.message, 'You cannot edit this recipe.');
  toasts.dismissToast(error.id);
  assert.equal(toasts.getToast(), null);
  unsubscribe();
  toasts.showToast({ variant: 'success', message: 'Recipe saved.' });
  assert.equal(notifications, 6);
});

test('deduplication retains distinct variants and custom headings and permits feedback after dismissal', () => {
  const { toasts } = setup();
  toasts.showToast({ variant: 'success', message: ' Saved. ', title: ' ' });
  toasts.showToast({ variant: 'success', message: 'Saved.' });
  toasts.showToast({ variant: 'warning', message: 'Saved.' });
  toasts.showToast({ variant: 'success', message: 'Saved.', title: ' Recipe saved ' });
  toasts.showToast({ variant: 'success', message: 'Saved.', title: 'Recipe saved' });

  const first = toasts.getToast();
  assert.equal(first.message, 'Saved.');
  assert.equal(first.title, undefined);
  toasts.dismissToast(first.id);
  const second = toasts.getToast();
  assert.equal(second.variant, 'warning');
  toasts.dismissToast(second.id);
  const third = toasts.getToast();
  assert.equal(third.title, 'Recipe saved');
  toasts.dismissToast(third.id);
  assert.equal(toasts.getToast(), null);
  toasts.showToast({ variant: 'success', message: 'Saved.' });
  assert.ok(toasts.getToast().id > first.id);
});

test('empty notifications do not enter the queue or notify subscribers', () => {
  const { toasts } = setup();
  let notifications = 0;
  toasts.subscribeToasts(() => notifications++);
  toasts.showToast({ variant: 'warning', message: ' \n ' });
  assert.equal(toasts.getToast(), null);
  assert.equal(notifications, 0);
});
