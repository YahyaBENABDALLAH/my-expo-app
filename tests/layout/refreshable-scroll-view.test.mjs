import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

for (const platform of ['ios', 'android']) {
  test(`${platform}: refresh stays single while callbacks change and recovers after rejection`, async () => {
    const native = (name) => (props) => h(name, props, props.children);
    const load = createSourceLoader({
      '@expo/ui': { ScrollView: native('ScrollView') },
      '@expo/ui/jetpack-compose': { PullToRefreshBox: native('Refresh') },
      '@expo/ui/jetpack-compose/modifiers': { fillMaxSize: () => ({ kind: 'fill' }) },
      '@expo/ui/swift-ui/modifiers': {
        tint: () => ({ kind: 'tint' }),
        refreshable: (refresh) => ({ kind: 'refresh', refresh }),
      },
      '@/hooks/use-theme': { useThemeColors: () => ({ tint: '#123456', surface: '#abcdef' }) },
      '@/components/ui/host/universal-host': { useHostColorScheme: () => 'dark' },
    });
    const { RefreshableScrollView } = load(
      `components/ui/refreshable-scroll-view/refreshable-scroll-view.${platform}.tsx`,
    );
    let changeVersion, resolve, reject;
    const calls = [];
    function Screen() {
      const [version, setVersion] = useState(0);
      changeVersion = setVersion;
      return h(
        RefreshableScrollView,
        {
          testID: 'refresh-content',
          onRefresh: () => {
            calls.push(version);
            return new Promise((done, fail) => {
              resolve = done;
              reject = fail;
            });
          },
        },
        'Saved content',
      );
    }
    const view = renderFixture(h(Screen));
    const scroll = view.findAll('ScrollView')[0];
    const refresh = () =>
      platform === 'android'
        ? view.findAll('Refresh')[0].props.onRefresh
        : view.findAll('ScrollView')[0].props.modifiers.find((m) => m.kind === 'refresh').refresh;
    const invoke = () => {
      let promise;
      view.flush(() => {
        promise = refresh()();
      });
      return promise;
    };
    const first = invoke();
    await Promise.resolve();
    assert.deepEqual(calls, [0]);
    view.flush(() => changeVersion(1));
    assert.equal(invoke(), first);
    assert.deepEqual(calls, [0]);
    if (platform === 'android') assert.equal(view.findAll('Refresh')[0].props.isRefreshing, true);
    resolve();
    await first;
    await new Promise(setImmediate);
    view.flush(() => {});
    if (platform === 'android') assert.equal(view.findAll('Refresh')[0].props.isRefreshing, false);
    const second = invoke();
    await Promise.resolve();
    assert.deepEqual(calls, [0, 1]);
    reject(new Error('Offline'));
    await assert.doesNotReject(second);
    await new Promise(setImmediate);
    view.flush(() => {});
    if (platform === 'android') assert.equal(view.findAll('Refresh')[0].props.isRefreshing, false);
    const third = invoke();
    await Promise.resolve();
    assert.deepEqual(calls, [0, 1, 1]);
    resolve();
    await third;
    await new Promise(setImmediate);
    view.flush(() => {});
    assert.equal(view.findAll('ScrollView')[0], scroll);
    assert.equal(scroll.props.testID, 'refresh-content');
    assert.equal(scroll.props.children, 'Saved content');
    view.unmount();
  });
}
