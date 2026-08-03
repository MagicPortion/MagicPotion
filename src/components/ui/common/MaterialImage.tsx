import { css } from "#styled-system/css";

interface MaterialImageProps {
  src: string;
  alt: string;
  size: number;
}

export default function MaterialImage({ src, alt, size }: MaterialImageProps) {
  const imageUrl = `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size, background: "transparent" }}
      className={css({ display: "block", maxWidth: "100%", objectFit: "contain", flexShrink: 0, userSelect: "none" })}
    />
  );
}
