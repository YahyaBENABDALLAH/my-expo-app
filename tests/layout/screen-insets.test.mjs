import assert from 'node:assert/strict';
import test from 'node:test';
import { screenInsets } from '../../src/lib/screen-insets.ts';

test('notched tab pages leave the home indicator to the bar', () => {
  assert.deepEqual(
    screenInsets({ top: 59, bottom: 34, left: 0, right: 0 }, { tabBarShown: true }),
    {
      paddingTop: 59,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  );
});
test('native header detail pages reserve only the unowned bottom edge', () => {
  assert.deepEqual(
    screenInsets({ top: 59, bottom: 34, left: 0, right: 0 }, { headerShown: true }),
    {
      paddingTop: 0,
      paddingBottom: 34,
      paddingLeft: 0,
      paddingRight: 0,
    },
  );
});
test('rotation updates asymmetric side cutouts without a cached portrait inset', () => {
  const portrait = { top: 59, bottom: 34, left: 0, right: 0 };
  const landscape = { top: 0, bottom: 21, left: 59, right: 8 };
  screenInsets(portrait, { headerShown: true, tabBarShown: true });
  assert.deepEqual(screenInsets(landscape, { headerShown: true, tabBarShown: true }), {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 59,
    paddingRight: 8,
  });
  assert.deepEqual(landscape, { top: 0, bottom: 21, left: 59, right: 8 });
});
test('headerless standalone screens support gesture, three-button and zero-inset devices', () => {
  for (const bottom of [0, 24, 48]) {
    assert.deepEqual(screenInsets({ top: 24, bottom, left: 0, right: 0 }), {
      paddingTop: 24,
      paddingBottom: bottom,
      paddingLeft: 0,
      paddingRight: 0,
    });
  }
});
