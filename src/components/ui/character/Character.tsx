import { css } from "#styled-system/css";

export type CharacterType = "witch" | "shopkeeper";
export type Expression = "normal" | "happy" | "sad" | "surprised";
export type Direction = "left" | "right";

interface CharacterProps {
  character: CharacterType;
  expression?: Expression;
  direction?: Direction;
  animate?: boolean;
  imageSrc?: string;
}

const PLACEHOLDER_COLOR: Record<CharacterType, string> = {
  witch:      "#d9a8c7",
  shopkeeper: "#a8c7d9",
};

const CHARACTER_LABEL: Record<CharacterType, string> = {
  witch:      "魔女",
  shopkeeper: "店主",
};

const CHARACTER_IMAGE: Partial<Record<CharacterType, string>> = {
  witch: "/MagicPotion/assets/witch.png",
  shopkeeper: "/MagicPotion/assets/shopkeeper.png",
};
export default function Character({
  character,
  expression = "normal",
  direction = "right",
  animate = true,
  imageSrc,
}: CharacterProps) {
  const color = PLACEHOLDER_COLOR[character];
  const label = CHARACTER_LABEL[character];
  const src = imageSrc ?? CHARACTER_IMAGE[character];

  return (
    <div style={{ position: "absolute", right: "-3%", bottom: "-910px" }}> {/* 位置調整 */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
          transformOrigin: "bottom center",
        })}
        style={{
          transform: direction === "left" ? "scaleX(-1)" : undefined,
          animation: animate ? "breathe 3s ease-in-out infinite" : undefined,
        }}
      >
        {src ? (
          <img src={src} width={1070} /> 
        ) : (
          <svg
            width="750"
            height="750"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="90" cy="70" r="50" fill={color} />
            <rect x="30" y="130" width="120" height="200" rx="20" fill={color} />
            <text x="90" y="76" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">
              {label}
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}