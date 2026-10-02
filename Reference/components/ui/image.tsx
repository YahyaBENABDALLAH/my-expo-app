import { DEFAULT_IMAGE } from "@/constants/images.constant";
import { Image as ExpoImage } from "expo-image";
import { useState } from "react";

type ExpoImageProps = React.ComponentProps<typeof ExpoImage>;

/**
 * Inspects a `source` prop and returns `DEFAULT_IMAGE` when the source
 * is empty, null, undefined, or carries a blank/missing URI.
 *
 * Handles every shape expo-image accepts:
 *   - null / undefined
 *   - number  (local require — always valid)
 *   - string  (direct URI — validated for non-empty)
 *   - { uri?: string | null }  (remote URI object)
 *   - ImageSource[]  (array of sources)
 */
function resolveSource(
  source: ExpoImageProps["source"],
): ExpoImageProps["source"] {
  if (source == null) return DEFAULT_IMAGE;
  if (typeof source === "number") return source;
  if (typeof source === "string") return source.trim() ? source : DEFAULT_IMAGE;
  if (Array.isArray(source)) return source.length > 0 ? source : DEFAULT_IMAGE;
  if (typeof source === "object" && "uri" in source) {
    const uri = (source as { uri?: string | null }).uri;
    return uri?.trim() ? source : DEFAULT_IMAGE;
  }
  return source;
}

/**
 * Drop-in replacement for expo-image's `<Image>` with two-layer fallback:
 *
 * 1. **Static** — resolves falsy / empty URIs before the first render,
 *    so there is never a broken request fired.
 * 2. **Runtime** — `onError` catches network 404s / CORS failures and
 *    swaps the source to the local default, preventing a broken image UI.
 *
 * Fully backward-compatible: pass `source` exactly as you would to
 * expo-image. No call-site changes required.
 */
function Image({ source, onError, ...props }: ExpoImageProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSource = hasError ? DEFAULT_IMAGE : resolveSource(source);

  return (
    <ExpoImage
      source={resolvedSource}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}

export { Image };
