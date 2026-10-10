import assert from 'node:assert/strict';
import { existsSync, realpathSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { resolve } = require('metro-resolver');
const { getDefaultConfig } = require('expo/metro-config');
const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const config = getDefaultConfig(projectRoot);

// Use Metro's real extension ordering: a declaration-only .ts can shadow .tsx.
const context = {
  originModulePath: path.join(projectRoot, 'src/components/ui/universal-text-input.tsx'),
  assetExts: new Set(config.resolver.assetExts),
  sourceExts: config.resolver.sourceExts,
  preferNativePlatform: true,
  mainFields: config.resolver.resolverMainFields,
  redirectModulePath: (modulePath) => modulePath,
  getPackageForModule: () => null,
  getPackage: () => null,
  doesFileExist: (filePath) => existsSync(filePath) && statSync(filePath).isFile(),
  fileSystemLookup: (filePath) =>
    existsSync(filePath)
      ? {
          exists: true,
          type: statSync(filePath).isDirectory() ? 'd' : 'f',
          realPath: realpathSync(filePath),
        }
      : { exists: false },
};

for (const platform of ['ios', 'android']) {
  for (const component of [
    'text-input-icon-button',
    'page-back-button',
    'refreshable-scroll-view',
    'error-toast',
    'universal-button-content',
    'loading-indicator',
    'floating-action-layout',
    'home-recipe-card-image',
    'switch',
    'checkbox',
    'slider',
    'picker',
    'list',
    'list-item',
    'field-group',
    'collapsible',
    'segmented-control',
  ]) {
    test(`${component} resolves to the ${platform} runtime implementation`, () => {
      const result = resolve(context, `./${component}`, platform);
      assert.equal(result.type, 'sourceFile');
      assert.equal(
        result.filePath,
        realpathSync(path.join(projectRoot, `src/components/ui/${component}.${platform}.tsx`)),
      );
    });
  }
}
