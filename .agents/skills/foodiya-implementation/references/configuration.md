# Configuration boundaries

Use the existing owners when changing a brand or environment. Human setup and
supported selectors belong to [development](../../../../docs/development.md#brand-and-environment-configuration).

- `config/brands/` holds serializable native identity/assets and integration
  references. Register a manifest in `config/brand.js`; its schema is the source
  for supported fields. Keep shared native settings in `app.json` and assembly in
  `app.config.js`. Presentation selects palette, heading-font, launch-artwork,
  initial header style and launch mode; add other fields only when their
  implementation has an actual consumer. `header` accepts Default/Dunes/Ribbon/
  Rain IDs; saved user style overrides that initial choice. `launch` selects
  minimal or branded through the existing launch component, not a new provider.
- `APP_BRAND` selects a client; `APP_VARIANT` selects development/preview/production.
  Preserve existing client identifiers and matching Firebase mappings unless the
  requested change includes a new identity. Variants do not automatically suffix
  IDs. A new side-by-side app needs its own identity and integration configuration.
- `src/config/developer-tools.ts` owns native preview gates. The public developer
  screen flag controls Home/Settings links and both catalog routes. Storybook needs
  its explicit public opt-in and `__DEV__`; its Metro integration is disabled in
  release mode. Keep these build/update flags out of saved appearance and brand
  manifests. Follow the [preview guide](../../../../docs/storybook.md) for commands,
  EAS profile defaults and the distinction between route access and bundle removal.
- The local default is an unlinked template. Production requires explicit brand,
  EAS references and API configuration. Keep the existing EAS build profiles'
  explicit client selection; never silently fall back to another client's link.
- Native consumers use `src/config/brand.ts` and the public `extra.brand`
  projection. Do not import the Node resolver, filesystem, manifests or private
  environment values into native application modules. `config/brand-assets.json`
  is public, native-safe asset metadata shared with config assembly.
- Palette colors stay in `src/constants/themes/`. Register a palette there and
  in the resolver's supported palette IDs; the native public accessor validates
  against the real theme registry. The root uses the selected palette without
  enabling runtime brand selection. See the
  [appearance contract](../../foodiya-ui-appearance/SKILL.md) for saved user
  appearance and isolated preview providers.
- `src/config/brand-assets.ts` owns literal Metro asset references and selected
  font/artwork helpers. Coordinate these with the metadata when registering new
  assets; never use a manifest path in a dynamic `require`. Font families are
  explicit per platform; verify the file's native names and supported scripts.
  Arabic uses native fallback; failed/unloaded optional fonts also return native
  typography rather than blocking startup behind the splash. Apply brand fonts to the existing auth
  and launch headings, not globally to every text control. See
  [bundled assets](../../../../docs/assets.md) for setup and build requirements.
- `config/api.js` is a small native-safe module shared by Node and transport.
  `src/services/api.config.ts` owns the lazy native environment read and safe error
  conversion. Keep refresh independent of the authenticated client; do not create
  an import cycle while sharing configuration.
- Read the installed SDK documentation before Expo config/API changes. Validate
  actual resolved Expo configs for affected brands and variants, including missing
  configuration paths, and distinguish those results from native build/device work.
- Include any new maintained root in both formatting scopes and the appropriate
  lint configuration. Update this existing guidance when behavior changes; do not
  create a separate brand framework or duplicate the manifest schema in prose.
