# Configuration boundaries

Use the existing owners when changing a brand or environment. Human setup and
supported selectors belong to [development](../../../../docs/development.md#brand-and-environment-configuration).

- `config/brands/` holds serializable native identity/assets and integration
  references. Register a manifest in `config/brand.js`; its schema is the source
  for supported fields. Keep shared native settings in `app.json` and assembly in
  `app.config.js`. Presentation currently selects palette, heading-font and launch-artwork
  IDs; add other fields only when their implementation has an actual consumer.
- `APP_BRAND` selects a client; `APP_VARIANT` selects development/preview/production.
  Preserve existing client identifiers and matching Firebase mappings unless the
  requested change includes a new identity. Variants do not automatically suffix
  IDs. A new side-by-side app needs its own identity and integration configuration.
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
  Arabic currently uses native fallback. Apply brand fonts to the existing auth
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
