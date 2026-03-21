import { useState } from "react";
import { cloudinaryUrl, CloudinaryOptions } from "../../lib/cloudinary";

interface CloudinaryImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Cloudinary public ID, e.g. "about/founder-portrait" */
  publicId: string;
  /** Cloudinary transformation options */
  cloudinaryOptions?: CloudinaryOptions;
  /** Optional fallback src if the image fails to load */
  fallbackSrc?: string;
  /** Alt text (required for accessibility) */
  alt: string;
}

/**
 * CloudinaryImage
 *
 * Drop-in replacement for <img> that automatically builds a Cloudinary URL.
 *
 * Usage:
 * ```tsx
 * import { CloudinaryImage } from "./components/CloudinaryImage";
 *
 * <CloudinaryImage
 *   publicId="about/founder-portrait"
 *   alt="Founder portrait"
 *   cloudinaryOptions={{ width: 800, fit: "fill", format: "auto" }}
 *   className="w-full h-full object-cover rounded-2xl"
 * />
 * ```
 */
export function CloudinaryImage({
  publicId,
  cloudinaryOptions = {},
  fallbackSrc,
  alt,
  className,
  ...rest
}: CloudinaryImageProps) {
  const src = cloudinaryUrl(publicId, cloudinaryOptions);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(
        fallbackSrc ||
          `https://placehold.co/${cloudinaryOptions.width ?? 400}x${
            cloudinaryOptions.height ?? 300
          }/1A1F4B/FFC857?text=${encodeURIComponent(alt)}`
      );
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...rest}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CloudinaryVideo — for video assets
// ─────────────────────────────────────────────────────────────────────────────
import { cloudinaryVideoUrl } from "../../lib/cloudinary";

interface CloudinaryVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  /** Cloudinary public ID for the video */
  publicId: string;
  cloudinaryOptions?: Omit<CloudinaryOptions, "format"> & {
    format?: "auto" | "mp4" | "webm";
  };
}

/**
 * CloudinaryVideo
 *
 * Drop-in replacement for <video> that builds a Cloudinary video URL.
 *
 * Usage:
 * ```tsx
 * <CloudinaryVideo
 *   publicId="brand/reel-2024"
 *   cloudinaryOptions={{ width: 1280, format: "mp4" }}
 *   autoPlay
 *   muted
 *   loop
 *   className="w-full rounded-2xl"
 * />
 * ```
 */
export function CloudinaryVideo({
  publicId,
  cloudinaryOptions = {},
  className,
  children,
  ...rest
}: CloudinaryVideoProps) {
  const src = cloudinaryVideoUrl(publicId, cloudinaryOptions);

  return (
    <video src={src} className={className} {...rest}>
      {children}
    </video>
  );
}
