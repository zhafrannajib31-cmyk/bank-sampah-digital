import Image from "next/image";

/** Aset dekoratif dari Figma (SVG/ikon) di public/; ukuran asli dipertahankan. */
export function Asset({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt=""
      aria-hidden
      unoptimized
      className={className}
    />
  );
}
