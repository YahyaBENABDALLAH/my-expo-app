import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { patchNativeStateSource } = require('../../scripts/patch-expo-ui-native-state.js');
const uiRoot = path.dirname(require.resolve('@expo/ui/package.json'));
const coreRoot = path.dirname(require.resolve('expo-modules-core/package.json'));

// Exercise the installed hook and core lifecycle with a small hook dispatcher.
// Native state/React scheduling are boundaries; this cannot prove device rendering.
function setup() {
  const slots = [];
  let cursor = 0;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const react = {
    useRef: (initial) => (slots[cursor++] ??= { kind: 'ref', current: initial }),
    useState: (initial) => {
      const slot = (slots[cursor++] ??= {
        kind: 'state',
        value: typeof initial === 'function' ? initial() : initial,
      });
      return [slot.value, (value) => (slot.value = value)];
    },
    useMemo: (factory, deps) => {
      const index = cursor++;
      if (!same(slots[index]?.deps, deps)) slots[index] = { kind: 'memo', deps, value: factory() };
      return slots[index].value;
    },
    useEffect: (effect, deps) => {
      const index = cursor++;
      const previous = slots[index];
      slots[index] = {
        ...previous,
        kind: 'effect',
        effect,
        deps,
        pending: !same(previous?.deps, deps),
      };
    },
  };
  const objects = [];
  class NativeObservableState {
    released = false;
    constructor({ value }) {
      this.text = value;
      objects.push(this);
    }
    assertLive() {
      if (this.released) throw new Error('Cannot use shared object that was already released');
    }
    getValue() {
      this.assertLive();
      return this.text;
    }
    setValue({ value }) {
      this.assertLive();
      this.text = value;
    }
    release() {
      this.released = true;
    }
  }
  function load(file, mocks) {
    const source = readFileSync(file, 'utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', compiled)(
      (name) => {
        assert.ok(Object.hasOwn(mocks, name), `Unexpected runtime import: ${name}`);
        return mocks[name];
      },
      module,
      module.exports,
    );
    return module.exports;
  }
  const lifecycle = load(
    path.join(coreRoot, 'src/hooks/useReleasingSharedObjectWithLifecycle.ts'),
    {
      react,
    },
  );
  const core = load(path.join(coreRoot, 'src/hooks/useReleasingSharedObject.ts'), {
    './useReleasingSharedObjectWithLifecycle': lifecycle,
  });
  const { useNativeState } = load(path.join(uiRoot, 'src/State/useNativeState.ts'), {
    react,
    'expo-modules-core': core,
    expo: { requireNativeModule: () => ({ ObservableState: NativeObservableState }) },
    './optionalWorklets': { worklets: null },
  });
  const effects = () => slots.filter((slot) => slot.kind === 'effect');
  return {
    objects,
    render(initial = '') {
      cursor = 0;
      // eslint-disable-next-line react-hooks/rules-of-hooks -- This test supplies its own hook dispatcher.
      const state = useNativeState(initial);
      for (const slot of effects()) {
        if (slot.pending) {
          slot.cleanup?.();
          slot.cleanup = slot.effect();
          slot.pending = false;
        }
      }
      return state;
    },
    replayEffects() {
      for (const slot of effects()) slot.cleanup?.();
      for (const slot of effects()) slot.cleanup = slot.effect();
    },
    cleanupEffects() {
      for (const slot of effects()) slot.cleanup?.();
    },
  };
}

test('native input value remains usable after effect cleanup and setup on initial mount', () => {
  const s = setup();
  const value = s.render('');
  s.replayEffects();
  assert.equal(value.get(), '');
  value.set('alex@example.com');
  assert.equal(s.render('ignored new seed'), value);
  assert.equal(value.get(), 'alex@example.com');
  value.set('');
  assert.equal(value.get(), '');
  assert.equal(s.objects.length, 1);
});

test('hidden native input state survives effect cleanup until it is restored', () => {
  const s = setup();
  const value = s.render('draft');
  s.cleanupEffects();
  assert.equal(value.get(), 'draft');
  value.set('reset while hidden');
  assert.equal(s.render(), value);
  s.replayEffects();
  assert.equal(value.get(), 'reset while hidden');
});

test('different fields and true remounts have independent native objects', () => {
  const login = setup();
  const password = setup();
  const a = login.render('login');
  const b = password.render('password');
  a.set('edited');
  assert.equal(b.get(), 'password');
  login.cleanupEffects();
  const remounted = setup().render('fresh');
  assert.notEqual(remounted, a);
  assert.equal(remounted.get(), 'fresh');
});

test('postinstall patch is idempotent and rejects changed upstream source', () => {
  const installed = readFileSync(path.join(uiRoot, 'src/State/useNativeState.ts'), 'utf8');
  assert.equal(patchNativeStateSource(installed), installed);
  assert.throws(() => patchNativeStateSource('export function changedHook() {}'), /source changed/);
});
