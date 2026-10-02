/**
 * Bundled local asset used as the universal fallback image.
 * Local assets work offline, load instantly (no network roundtrip),
 * and guarantee the app never shows a broken image state.
 *
 * Replace `splash-icon.png` with a proper food/recipe placeholder
 * once the design asset is ready.
 */
const DEFAULT_IMAGE = require("@/assets/images/splash-icon.png") as number;

export { DEFAULT_IMAGE };
