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
  originModulePath: path.join(projectRoot, 'src/components/ui/index.ts'),
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
    'button/universal-button-content.tsx',
    'checkbox/checkbox.tsx',
    'collapsible/collapsible.tsx',
    'error-toast/error-toast.tsx',
    'field-group/field-group.tsx',
    'floating-action/floating-action-button.tsx',
    'floating-action/floating-action-layout.tsx',
    'home-recipe-card/home-recipe-card-image.tsx',
    'list/list.tsx',
    'list-item/list-item.tsx',
    'loading/loading-indicator.tsx',
    'native/native-fill-width.ts',
    'navigation/navigation-glass-surface.tsx',
    'navigation/navigation-tab.tsx',
    'page/page-back-button.tsx',
    'picker/picker.tsx',
    'recipe-stepper/recipe-stepper-layout.tsx',
    'refreshable-scroll-view/refreshable-scroll-view.tsx',
    'segmented-control/segmented-control.tsx',
    'skeleton/skeleton-modifiers.ts',
    'slider/slider.tsx',
    'switch/switch.tsx',
    'text-input/text-input-icon-button.tsx',
    'text-input/text-input-modifiers.ts',
  ]) {
    test(`${component} resolves to the ${platform} runtime implementation`, () => {
      const result = resolve(context, `./${component.replace(/\.tsx?$/, '')}`, platform);
      assert.equal(result.type, 'sourceFile');
      assert.equal(
        result.filePath,
        realpathSync(
          path.join(
            projectRoot,
            `src/components/ui/${component.replace(/(\.tsx?)$/, `.${platform}$1`)}`,
          ),
        ),
      );
    });
  }
  test(`the lazy map entry point resolves on ${platform}`, () => {
    const result = resolve(context, './map-experience', platform);
    assert.equal(result.type, 'sourceFile');
    assert.equal(
      result.filePath,
      realpathSync(path.join(projectRoot, 'src/components/ui/map-experience/index.tsx')),
    );
  });
}
