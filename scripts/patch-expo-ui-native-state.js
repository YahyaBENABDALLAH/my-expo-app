const fs = require('node:fs');
const path = require('node:path');

const marker = '// Project workaround: keep native UI state alive for the React state lifetime.';
const originalHook = `export function useNativeState<T>(initialValue: T): ObservableState<T> {
  const initialValueRef = useRef(initialValue);
  return useReleasingSharedObject(() => {
    const state = new ExpoUI.ObservableState({ value: initialValueRef.current });
    defineValueProperty(state);
    defineOnChangeProperty(state);
    return state;
  }, []) as ObservableState<T>;
}`;
const fixedHook = `export function useNativeState<T>(initialValue: T): ObservableState<T> {
  ${marker}
  // Effect cleanup can run while React retains state (replay, hiding, refresh).
  // Explicit release leaves that retained object, and queued view props, invalid.
  // ObservableState owns small UI state, so let Expo's SharedObject GC release it
  // once React and all other JS consumers have dropped their references.
  const [state] = useState(() => {
    const state = new ExpoUI.ObservableState({ value: initialValue });
    defineValueProperty(state);
    defineOnChangeProperty(state);
    return state as ObservableState<T>;
  });
  return state;
}`;

function patchNativeStateSource(source) {
  const normalized = source.replaceAll('\r\n', '\n');
  if (normalized.includes(marker)) return source;
  const coreImport =
    "import { type SharedObject, useReleasingSharedObject } from 'expo-modules-core';";
  const reactImport = "import { useRef } from 'react';";
  if (
    !normalized.includes(coreImport) ||
    !normalized.includes(reactImport) ||
    !normalized.includes(originalHook)
  ) {
    throw new Error(
      'Expo UI native-state source changed. Review/remove the SDK 57 lifecycle patch.',
    );
  }
  return normalized
    .replace(coreImport, "import { type SharedObject } from 'expo-modules-core';")
    .replace(reactImport, "import { useState } from 'react';")
    .replace(originalHook, fixedHook)
    .replace(
      'Creates an observable native state that is automatically cleaned up when the\n * component unmounts.',
      'Creates an observable native state retained by React and cleaned up by Expo GC.',
    );
}

function applyPatch() {
  const uiRoot = path.dirname(require.resolve('@expo/ui/package.json'));
  const { version } = JSON.parse(fs.readFileSync(path.join(uiRoot, 'package.json'), 'utf8'));
  if (version !== '57.0.21') {
    throw new Error(`Review/remove the native-state lifecycle patch for @expo/ui ${version}.`);
  }
  const file = path.join(uiRoot, 'src', 'State', 'useNativeState.ts');
  const source = fs.readFileSync(file, 'utf8');
  const patched = patchNativeStateSource(source);
  if (patched !== source) fs.writeFileSync(file, patched);
}

module.exports = { patchNativeStateSource };
if (require.main === module) applyPatch();
