import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { storyNameFromExport, toId } from 'storybook/internal/csf';

const root = resolve(import.meta.dirname, '../..');

test('native interaction flows reference discoverable Storybook stories', () => {
  const storyRoot = resolve(root, '.rnstorybook/stories');
  const ids = new Set();
  for (const file of readdirSync(storyRoot, { recursive: true })) {
    if (!file.endsWith('.stories.tsx')) continue;
    const source = readFileSync(resolve(storyRoot, file), 'utf8');
    const title = source
      .slice(source.indexOf('const meta ='))
      .match(/title:\s*['"]([^'"]+)['"]/)?.[1];
    assert.ok(title, `${file} needs a literal story title`);
    for (const [, name] of source.matchAll(/export const (\w+): Story\b/g)) {
      ids.add(toId(title, storyNameFromExport(name)));
    }
  }
  const flowRoot = resolve(root, '.maestro');
  let checked = 0;
  for (const file of readdirSync(flowRoot, { recursive: true })) {
    // Generated results can retain old story IDs; validate maintained flows only.
    if (!file.endsWith('.yaml') || file.replaceAll('\\', '/').startsWith('results/')) continue;
    const source = readFileSync(resolve(flowRoot, file), 'utf8');
    for (const [id] of source.matchAll(/\b(?:expo-ui|pages|recipes)-[a-z0-9-]+--[a-z0-9-]+\b/g)) {
      assert.ok(ids.has(id), `${file} references missing story ${id}`);
      checked++;
    }
  }
  assert.ok(checked > 0, 'Expected native flows to reference stories');
});
