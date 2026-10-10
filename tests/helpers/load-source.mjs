import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../src');
const nodeRequire = createRequire(import.meta.url);
const compiled = new Map();

/** Load source with isolated module state, replacing only explicit external boundaries. */
export function createSourceLoader(mocks = {}) {
  const modules = new Map();
  function load(file) {
    const path = resolve(sourceRoot, file);
    const relative = path.slice(sourceRoot.length + 1).replaceAll('\\', '/');
    if (Object.hasOwn(mocks, relative)) return mocks[relative];
    if (modules.has(path)) return modules.get(path);
    if (path.endsWith('.json')) {
      const value = JSON.parse(readFileSync(path, 'utf8'));
      modules.set(path, value);
      return value;
    }
    if (!compiled.has(path)) {
      compiled.set(
        path,
        ts.transpileModule(readFileSync(path, 'utf8'), {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.ReactJSX,
          },
          fileName: path,
        }).outputText,
      );
    }
    const module = { exports: {} };
    modules.set(path, module.exports);
    const requireSource = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith('@/') || name.startsWith('.')) {
        const target = name.startsWith('@/')
          ? resolve(sourceRoot, name.slice(2))
          : resolve(dirname(path), name);
        const alias = `@/${target.slice(sourceRoot.length + 1).replaceAll('\\', '/')}`;
        if (Object.hasOwn(mocks, alias)) return mocks[alias];
        const source = [target, `${target}.ts`, `${target}.tsx`].find(existsSync);
        return load(source ?? `${target}.ts`);
      }
      return nodeRequire(name);
    };
    new Function('require', 'module', 'exports', compiled.get(path))(
      requireSource,
      module,
      module.exports,
    );
    modules.set(path, module.exports);
    return module.exports;
  }
  // Exercise the real dictionaries and translation hooks in deterministic English fixtures.
  const i18n = load('lib/i18n.ts').default;
  void i18n?.changeLanguage('en');
  return load;
}
