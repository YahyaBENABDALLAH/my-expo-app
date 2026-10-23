const { statSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { z } = require('zod');
const { resolveApiBaseUrl } = require('./api');
const assets = require('./brand-assets.json');

const brands = {
  likan: require('./brands/likan.json'),
  template: require('./brands/template.json'),
};
const variants = ['development', 'preview', 'production'];
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const asset = z.string().startsWith('./').min(3);
const brandSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().trim().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  scheme: z.string().regex(/^[a-z][a-z0-9+.-]*$/),
  icon: asset,
  presentation: z.strictObject({
    palette: z.enum(['ux', 'instagram']),
    header: z.enum(['default', 'dunes', 'ribbon', 'rain']),
    launch: z.enum(['minimal', 'branded']),
    headingFont: z.string().refine((id) => Object.hasOwn(assets.headingFonts, id)),
    launchArtwork: z.string().refine((id) => Object.hasOwn(assets.launchArtworks, id)),
  }),
  ios: z.strictObject({
    bundleIdentifier: z.string().regex(/^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/),
  }),
  android: z.strictObject({
    package: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]*)+$/),
    googleServicesFile: asset.optional(),
    adaptiveIcon: z.strictObject({
      backgroundColor: color,
      foregroundImage: asset,
      backgroundImage: asset,
      monochromeImage: asset,
    }),
  }),
  splash: z.strictObject({
    image: asset,
    backgroundColor: color,
    darkBackgroundColor: color,
  }),
  eas: z
    .strictObject({
      owner: z.string().regex(/^[a-zA-Z0-9_-]+$/),
      projectId: z.uuid(),
    })
    .optional(),
});
const projectRoot = path.resolve(__dirname, '..');

function requireAsset(file, field) {
  const absolute = path.resolve(projectRoot, file);
  const relative = path.relative(projectRoot, absolute);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Brand asset ${field} must be inside the project.`);
  }
  try {
    if (statSync(absolute).isFile()) return absolute;
  } catch {
    // Report the manifest field rather than exposing file contents.
  }
  throw new Error(`Missing brand asset ${field}: ${file}`);
}

/** Resolve a build-time brand without mutating manifests or environment variables. */
function resolveBrand(env = process.env) {
  const variant = env.APP_VARIANT?.trim() || 'development';
  if (!variants.includes(variant)) {
    throw new Error(`APP_VARIANT must be one of: ${variants.join(', ')}.`);
  }
  const selected = env.APP_BRAND?.trim();
  if (variant === 'production' && !selected) {
    throw new Error('Production requires an explicit APP_BRAND.');
  }
  const id = selected || 'template';
  if (!Object.hasOwn(brands, id)) {
    throw new Error(`Unknown APP_BRAND. Registered brands: ${Object.keys(brands).join(', ')}.`);
  }
  const parsed = brandSchema.safeParse(brands[id]);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Invalid brand manifest ${id}; check fields: ${fields}.`);
  }
  const brand = parsed.data;
  if (brand.id !== id) throw new Error(`Brand manifest ID must match its registry key: ${id}.`);

  requireAsset(brand.icon, 'icon');
  requireAsset(brand.splash.image, 'splash.image');
  const headingFont = assets.headingFonts[brand.presentation.headingFont];
  const launchArtwork = assets.launchArtworks[brand.presentation.launchArtwork];
  if (headingFont.file) requireAsset(headingFont.file, 'presentation.headingFont');
  requireAsset(launchArtwork.file, 'presentation.launchArtwork');
  for (const field of ['foregroundImage', 'backgroundImage', 'monochromeImage']) {
    requireAsset(brand.android.adaptiveIcon[field], `android.adaptiveIcon.${field}`);
  }
  if (brand.android.googleServicesFile) {
    const file = requireAsset(brand.android.googleServicesFile, 'android.googleServicesFile');
    let google;
    try {
      google = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      throw new Error('Brand android.googleServicesFile must contain valid JSON.');
    }
    const matches =
      Array.isArray(google?.client) &&
      google.client.some(
        (client) =>
          client?.client_info?.android_client_info?.package_name === brand.android.package,
      );
    if (!matches) {
      throw new Error('Brand Firebase configuration does not match android.package.');
    }
  }
  if (variant === 'production' && !brand.eas) {
    throw new Error('Production requires this brand to define its own EAS owner and projectId.');
  }
  if (env.EXPO_PUBLIC_API_URL?.trim() || variant === 'production') {
    resolveApiBaseUrl(env.EXPO_PUBLIC_API_URL);
  }
  return { brand, variant };
}

module.exports = { resolveBrand };
