import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSourceLoader } from '../helpers/load-source.mjs';

// Render the actual JS presentation component. Native views are replaced only
// at their boundary; these assertions do not establish native layout or colors.
const load = createSourceLoader({
  '@expo/ui': { Column: ({ children }) => createElement('section', null, children) },
  '@/components/ui/universal-text': {
    UniversalTextContent: ({ children }) => createElement('p', null, children),
  },
  '@/components/ui/loading-state': {
    LoadingContent: ({ label }) => createElement('p', null, label),
  },
  '@/components/ui/universal-button-content': {
    UniversalButtonContent: ({ label, disabled }) => createElement('button', { disabled }, label),
  },
});
const { QueryContent } = load('components/ui/query-content.tsx');
function render(overrides = {}, props = {}) {
  const query = {
    data: undefined,
    error: null,
    fetchStatus: 'idle',
    isFetching: false,
    isEnabled: true,
    refetch: () => {},
    ...overrides,
  };
  return renderToStaticMarkup(
    createElement(QueryContent, { query, ...props }, createElement('p', null, 'Cached recipe')),
  );
}

test('disabled query explains its prerequisite and never implies an active load', () => {
  const output = render({ isEnabled: false }, { disabledMessage: 'Sign in to view your recipes.' });
  assert.ok(output.includes('Sign in to view your recipes.'));
  assert.equal(output.includes('Loading'), false);
  assert.equal(output.includes('Cached recipe'), false);
  assert.equal(output.includes('Retry'), false);
});

test('pending fetching and paused offline are distinct with no empty-state content', () => {
  const fetching = render({ fetchStatus: 'fetching', isFetching: true });
  const paused = render({ fetchStatus: 'paused' });
  assert.ok(fetching.includes('Loading…'));
  assert.ok(paused.includes('Offline. Reconnect to load content.'));
  assert.equal(paused.includes('Loading'), false);
  for (const output of [fetching, paused]) {
    assert.equal(output.includes('Cached recipe'), false);
    assert.equal(output.includes('No results'), false);
  }
});

test('background refresh, offline state and refetch failure retain cached content', () => {
  for (const [state, message] of [
    [{ fetchStatus: 'fetching', isFetching: true }, 'Refreshing…'],
    [{ fetchStatus: 'paused' }, 'Offline. Showing your saved content.'],
    [{ error: new Error('server') }, 'Refresh failed. Showing your saved content.'],
  ]) {
    const output = render({ data: [], ...state });
    assert.ok(output.includes(message));
    assert.ok(output.includes('Cached recipe'));
  }
});

test('initial errors keep persistent context and suppress retry while disabled or fetching', () => {
  const initial = render({ error: new Error('server') });
  assert.ok(initial.includes('Content couldn’t load. Please try again.'));
  assert.ok(initial.includes('<button>Retry</button>'));
  for (const state of [
    { isEnabled: false },
    { isFetching: true, fetchStatus: 'fetching' },
    { fetchStatus: 'paused' },
  ]) {
    assert.ok(
      render({ error: new Error('server'), ...state }).includes(
        '<button disabled="">Retry</button>',
      ),
    );
  }
});

test('empty content appears only once data exists and uses its domain-specific message', () => {
  assert.equal(render({}, { empty: true }).includes('No results'), false);
  const output = render({ data: [] }, { empty: true, emptyMessage: 'No favorite recipes yet.' });
  assert.ok(output.includes('No favorite recipes yet.'));
  assert.equal(output.includes('Cached recipe'), false);
});
