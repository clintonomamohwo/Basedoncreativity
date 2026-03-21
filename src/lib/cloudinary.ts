// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const CLOUDINARY_CLOUD_NAME = "BaseCreator";

export type CloudinaryFit =
  | "fill"
  | "fit"
  | "crop"
  | "scale"
  | "thumb"
  | "pad"
  | "limit";

export type CloudinaryFormat = "auto" | "webp" | "jpg" | "png" | "avif";

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  fit?: CloudinaryFit;
  format?: CloudinaryFormat;
  quality?: number | "auto";
  gravity?: string;
  /** Any extra raw Cloudinary transformation string, e.g. "e_grayscale" */
  effect?: string;
}

/**
 * Build a Cloudinary delivery URL.
 *
 * @param publicId  The public ID of your asset (e.g. "about/founder-portrait")
 * @param options   Optional transformation options
 *
 * @example
 * cloudinaryUrl("about/founder-portrait", { width: 800, fit: "fill", format: "auto" })
 * // → https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_800,c_fill,f_auto/about/founder-portrait
 */
export function cloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    fit = "fill",
    format = "auto",
    quality = "auto",
    gravity,
    effect,
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (fit) transforms.push(`c_${fit}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (format) transforms.push(`f_${format}`);
  if (quality !== undefined) transforms.push(`q_${quality}`);
  if (effect) transforms.push(effect);

  const transformStr = transforms.join(",");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
}

/**
 * Build a Cloudinary video delivery URL.
 *
 * @param publicId  The public ID of your video asset
 * @param options   Optional transformation options
 */
export function cloudinaryVideoUrl(
  publicId: string,
  options: Omit<CloudinaryOptions, "format"> & { format?: "auto" | "mp4" | "webm" } = {}
): string {
  const {
    width,
    height,
    fit = "fill",
    format = "auto",
    quality = "auto",
    gravity,
    effect,
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (fit) transforms.push(`c_${fit}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (format) transforms.push(`f_${format}`);
  if (quality !== undefined) transforms.push(`q_${quality}`);
  if (effect) transforms.push(effect);

  const transformStr = transforms.join(",");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformStr}/${publicId}`;
}