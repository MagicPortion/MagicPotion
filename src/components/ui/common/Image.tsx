import { css } from "#styled-system/css";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Image({ src, alt, width, height, className, priority = false }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      draggable={false}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        display: "block",
        maxWidth: "100%",
        objectFit: "contain",
        flexShrink: 0,
        userSelect: "none",
      }}
      className={css({ display: "block", maxWidth: "100%", objectFit: "contain", flexShrink: 0, userSelect: "none" }, className)}
    />
  );
}