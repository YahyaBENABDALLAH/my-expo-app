import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

test('AuthProvider skips token-only notifications while preserving metadata and session-generation updates', async () => {
  const user = { uuid: 'alice', firstName: 'Alice', isChef: false };
  let listener,
    context,
    renders = 0,
    version = 1;
  const load = createSourceLoader({
    '@/constants/app-dev': { appDevEnabled: false },
    '@/services/auth/auth.lifecycle': {
      restoreSession: async () => ({ user }),
      signOut: async () => {},
    },
    '@/services/auth/auth.session': {
      getSessionVersion: () => version,
      subscribeAuthSession: (callback) => {
        listener = callback;
        return () => {
          listener = undefined;
        };
      },
    },
  });
  const { AuthProvider, useAuthContext } = load('context/auth.context.tsx');
  function Consumer() {
    renders++;
    context = useAuthContext();
    return null;
  }
  const view = renderFixture(h(AuthProvider, null, h(Consumer)));
  try {
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    const baseline = renders;
    const notify = (nextUser) =>
      view.flush(() => listener({ session: { user: nextUser }, reason: 'updated' }));
    notify({ ...user });
    assert.equal(renders, baseline);
    notify({ ...user, isChef: true, chefProfileUuid: 'chef' });
    assert.equal(renders, baseline + 1);
    assert.equal(context.user.chefProfileUuid, 'chef');
    version++;
    notify({ ...context.user });
    assert.equal(renders, baseline + 2);
    view.flush(() => listener({ session: null, reason: 'cleared' }));
    assert.equal(context.user, null);
    assert.equal(context.status, 'unauthenticated');
  } finally {
    view.unmount();
  }
});
