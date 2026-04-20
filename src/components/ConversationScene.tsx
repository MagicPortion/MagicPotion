import { useState } from "react";
import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";

const dialogues = [
  "おはよう！今日もポーション作りを頑張ろう！",
  "まずはお店で材料を仕入れなきゃね。",
  "良い材料が見つかるといいな♪",
];

export default function ConversationScene() {
  const { advancePhase } = useGameStore();
  const [index, setIndex] = useState(0);
  const { width, height } = useWindowSize();

  const commands: DrawCommand[] = [
    // 背景モック（後で朝の部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    // 魔女モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width * 0.5 - 50, y: height * 0.2, width: 100, height: 160, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.2 + 68, text: "魔女", fontSize: 14, textColor: "#888" },
  ];

  const handleClick = () => {
    if (index < dialogues.length - 1) {
      setIndex(index + 1);
    } else {
      advancePhase();
    }
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      {/* フルスクリーンキャンバス */}
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0xfff0f5}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* ダイアログボックス（下部オーバーレイ） */}
      <div
        onClick={handleClick}
        className={css({
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(720px, 90vw)",
          bg: "pastel.lavender",
          p: "24px 32px",
          borderRadius: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          border: "2px solid",
          borderColor: "pastel.lilac",
          transition: "background 0.2s",
          _hover: { bg: "pastel.rose" },
        })}
        style={{ zIndex: 10 }}
      >
        <p style={{ fontSize: 18, color: "#4a3f55", margin: 0 }}>
          {dialogues[index]}
        </p>
        <span style={{ fontSize: 13, color: "#8b7f99", whiteSpace: "nowrap" }}>
          {index < dialogues.length - 1 ? "▶ 次へ" : "▶ お店へ"}
        </span>
      </div>
    </div>
  );
}
