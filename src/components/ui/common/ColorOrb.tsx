import { css } from "#styled-system/css";
import { getPotionImageUrl } from "../../../data/gameData";

interface ColorOrbProps {
  colorHex: string;
  size: number;
  image?: string;
}

export default function ColorOrb({ colorHex, size, image }: ColorOrbProps) {
  const imageUrl = getPotionImageUrl(image);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={css({ display: "block", flexShrink: 0, objectFit: "contain" })}
        style={{ width: size, height: size, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}
      />
    );
  }

  return (
    // backgroundColor・boxShadow は動的な colorHex のためinline style
    <span
      style={{
        backgroundColor: `#${colorHex}`,
        boxShadow: `0 4px 32px #${colorHex}77`,
        width: size,
        height: size,
      }}
      className={css({ display: "block", borderRadius: "50%", flexShrink: 0 })}
    />
  );
}
