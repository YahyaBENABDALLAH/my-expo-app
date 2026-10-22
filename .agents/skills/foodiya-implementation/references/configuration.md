# Configuration boundaries

Use the existing owners when changing a brand or environment. Human setup and
supported selectors belong to [development](../../../../docs/development.md#brand-and-environment-configuration).

- `config/brands/` holds serializable native identity/assets and integration
  references. Register a manifest in `config/brand.js`; its schema is the source
  for supported fields. Keep shared native settings in `app.json` and assembly in
  `app.config.js`. Do not add speculative capability or presentation fields.
- `APP_BRAND` selects a client; `APP_VARIANT` selects development/preview/production.
  Preserve existing client identifiers and matching Firebase mappings unless the
  requested change includes a new identity. Variants do not automatically suffix
  IDs. A new side-by-side app needs its own identity and integration configuration.
- The local default is an unlinked template. Production requires explicit brand,
  EAS references and API configuration. Keep the existing EAS build profiles'
  explicit client selection; never silently fall back to another client's link.
- Native consumers use `src/config/brand.ts` and the public `extra.brand`
  projection. Do not import the Node resolver, filesystem, manifests or private
  environment values into native application modules. Keep Metro asset references
  static when runtime artwork/fonts are connected.
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
