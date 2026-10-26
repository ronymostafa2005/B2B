import Image from "next/image";

type CommonProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * `next/image` lazy-loads by default. Pass "eager" for images that are
   * already laid out offscreen but expected to appear without a pop-in, such
   * as the off-centre slides of a rotating carousel.
   */
  loading?: "eager" | "lazy";
};

/**
 * Which axis CSS leaves automatic, when the other is pinned by a class.
 *
 * Only the automatic axis may be set inline: an inline style beats a Tailwind
 * class, so setting both would silently override the pinned dimension and the
 * image would render at its intrinsic size.
 */
type AutoAxis = "width" | "height" | "both";

type SmartImageProps =
  | (CommonProps & { fill: true; width?: never; height?: never; autoAxis?: never })
  | (CommonProps & {
      fill?: false;
      width: number;
      height: number;
      /**
       * Set when CSS pins one axis (e.g. `h-10 w-auto` pins the height, so the
       * width is automatic). Without it `next/image` warns that one dimension
       * was modified but not the other.
       */
      autoAxis?: AutoAxis;
    });

/**
 * Image source that the client can edit from the dashboard.
 *
 * Bundled assets and uploads are local paths, so they go through `next/image`
 * and get optimised. An absolute URL falls back to a plain `<img>`: the client
 * types these in by hand, and `next/image` throws for any host that is not
 * listed in `images.remotePatterns`, which would take the page down rather than
 * just showing a broken image.
 */
export function SmartImage({ src, alt, className, sizes, priority, loading, ...rest }: SmartImageProps) {
  const isLocal = src.startsWith("/");

  if (!isLocal) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }

  if (rest.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? "100vw"}
        priority={priority}
        loading={loading}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={rest.width}
      height={rest.height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={loading}
      style={
        rest.autoAxis
          ? {
              ...(rest.autoAxis !== "height" && { width: "auto" }),
              ...(rest.autoAxis !== "width" && { height: "auto" }),
            }
          : undefined
      }
    />
  );
}
