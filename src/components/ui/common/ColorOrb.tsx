import { css } from "#styled-system/css";

interface ColorOrbProps {
  colorHex: string;
  size: number;
}

export default function ColorOrb({ colorHex, size }: ColorOrbProps) {
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
