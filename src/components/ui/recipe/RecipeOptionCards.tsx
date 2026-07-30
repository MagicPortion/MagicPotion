import { useState } from "react"; // 1. useState をインポート
import { css } from "#styled-system/css";
import type { PotionDef } from "../../../data/types";

export interface RecipeOption {
  id: string;
  potion: PotionDef;
  level: number;
  nextLevel: number;
  nextPrice: number;
}

interface RecipeOptionCardsProps {
  options: RecipeOption[];
  onLearn: (id: string) => void;
}

export default function RecipeOptionCards({ options, onLearn }: RecipeOptionCardsProps) {
  // 2. 選択中のレシピIDを管理するStateを追加（初期値は null = 未選択）
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. 決定ボタンを押した時の処理
  const handleConfirm = () => {
    if (selectedId) {
      onLearn(selectedId);
    }
  };

  return (
    <div
      className={css({
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
      })}
    >
      <div
        className={css({
          background: "rgba(8, 6, 18, 0.8)",
          border: "1px solid rgba(200, 168, 75, 0.3)",
          borderRadius: "24px",
          p: "32px 40px 24px 40px", // 決定ボタン用に下の余白を少し調整
          boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
          backdropFilter: "blur(2px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
          width: "750px", // 決定ボタンの配置を安定させるため幅を固定（必要に応じて調整してください）
          ml: "-750px",
        })}
      >
    <div className={css({ mb: "12px", width: "100%", textAlign: "center" })}>
      <div className={css({ position: "relative", width:"400px", mx: "auto", bg: "rgba(8,6,18,0.93)", color: "#e8d8b8", border: "1px solid rgba(200,168,75,0.4)", fontSize: "36px", fontWeight: "bold", pl: "80px", pr: "80px", pt: "12px", pb: "12px", borderRadius: "10px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}>
          レシピ選択
      </div>
      <p className={css({ fontSize: "24px", color: "#e8d8b8", m: "12px 0 0" })}>
        獲得するレシピを1つ選んでね
      </p>
    </div>

        {/* グリッドコンテナ */}
        <div
          className={css({ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "25px" })}
          style={{ gridTemplateAreas: `"a a b b c c" ". d d e e ."` }}
        >
          {options.map((opt, i) => {
            const isKnown = opt.level > 0;
            const areas = ["a", "b", "c", "d", "e"];
            
            // 4. このカードが現在選択されているかどうか
            const isSelected = selectedId === opt.id;

            return (
              <button
                key={opt.id}
                style={{ gridArea: areas[i] }}
                // 5. クリック時は即時獲得ではなく、選択状態にするだけに変更
                onClick={() => setSelectedId(opt.id)}
                className={css({
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                  bg: "white", 
                  borderRadius: "20px", p: "20px 16px 16px",
                  cursor: "pointer", width: "200px",
                  boxShadow: isSelected ? "0 0 0 5px #ffb347, 0 12px 32px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.1)", // 選択中のハイライト
                  border: "3px solid",
                  borderColor: isSelected ? "#ffb347" : (isKnown ? "pastel.lilac" : "pastel.mint"), // 選択中はオレンジ等の目立つ色に
                  transform: isSelected ? "translateY(-6px) scale(1.04)" : "none", // 選択中は少し浮かせたままにする
                  transition: "all 0.18s",
                  _hover: {
                    transform: "translateY(-6px) scale(1.04)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    borderColor: isSelected ? "#ffb347" : (isKnown ? "pastel.lavender" : "pastel.sage"),
                  },
                })}
              >
                <span
                  style={{
                    backgroundColor: `#${opt.potion.colorHex}`,
                    boxShadow: `0 4px 16px #${opt.potion.colorHex}88`,
                  }}
                  className={css({ display: "block", w: "64px", h: "64px", borderRadius: "50%", flexShrink: 0 })}
                />
                <span className={css({ fontSize: "30px", fontWeight: "bold", color: "#4a3f55", textAlign: "center", lineHeight: 1.3 })}>
                  {opt.potion.name}
                </span>
                <span className={css({ fontSize: "24px", color: "#8b7f99" })}>{opt.nextPrice}G</span>
                <span className={css({
                  fontSize: "24px", fontWeight: "bold",
                  px: "10px", py: "3px", borderRadius: "20px",
                  bg: isKnown ? "pastel.lilac" : "pastel.mint",
                  color: "#4a3f55", whiteSpace: "nowrap",
                })}>
                  {isKnown ? `Lv.${opt.level} → ${opt.nextLevel}` : "Lv.1 習得"}
                </span>
              </button>
            );
          })}
        </div>

        {/* 6. 右下に決定ボタンを配置するエリア */}
        <div className={css({ display: "flex", justifyContent: "flex-end", width: "100%", mt: "2px" })}>
          <button
            onClick={handleConfirm}
            disabled={!selectedId} // 何も選択されていないときは押せない
            className={css({
              fontSize: "26px",
              fontWeight: "bold",
              color: "white",
              bg: selectedId ? "#46a1ea" : "#ccc", // 選択中のみ緑色、未選択はグレー
              border: "none",
              borderRadius: "12px",
              padding: "12px 36px",
              cursor: selectedId ? "pointer" : "not-allowed",
              boxShadow: selectedId ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              transition: "all 0.15s",
              _hover: selectedId ? {
                bg: "#4cae4c",
                transform: "translateY(-2px)",
              } : {},
              _active: selectedId ? {
                transform: "translateY(1px)",
              } : {},
            })}
          >
            決定
          </button>
        </div>

      </div>
    </div>  
  );
}
