import { useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, shuffleArray, type MaterialDef } from "../../data/gameData";
import RecipeBookPopup from "../ui/RecipeBookPopup";

export default function ShopScene() {
  const { materials, buyMaterial, advanceScene } = useGameStore();
  const [message, setMessage] = useState("いらっしゃいませ！材料をお選びください。");
  const [shopItems] = useState<MaterialDef[]>(() => shuffleArray(MATERIALS).slice(0, 6));
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const { width, height } = useWindowSize();

  const handleBuy = (item: MaterialDef) => {
    const success = buyMaterial(item.id, item.price);
    setMessage(success ? `${item.name}を購入しました！` : "お金が足りません…");
  };

  const ownedMaterials = Object.entries(materials).filter(([, c]) => c > 0);

  const commands = useMemo<DrawCommand[]>(() => [
    // 背景モック（後でお店の画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfff9c4 },
    // 店主モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width - 130, y: height * 0.3, width: 100, height: 160, color: 0xd8b4fe },
    { type: "text", x: width - 114, y: height * 0.3 + 72, text: "店主", fontSize: 14, textColor: "#888" },
  ], [width, height]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0xfff9c4} />

      {/* メッセージ */}
      <div
        style={{ position: "absolute", top: height * 0.52, left: "50%", transform: "translateX(-50%)", zIndex: 10, whiteSpace: "nowrap" }}
        className={css({ fontSize: "15px", color: "#4a3f55", bg: "pastel.cream", px: "16px", py: "6px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" })}
      >
        {message}
      </div>

      {/* 購入ボタン群 */}
      <div
        style={{ position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
        className={css({ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "700px" })}
      >
        {shopItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleBuy(item)}
            className={css({
              bg: "pastel.mint", border: "2px solid", borderColor: "pastel.sage",
              borderRadius: "12px", p: "10px 16px", cursor: "pointer",
              fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
              transition: "all 0.15s",
              _hover: { bg: "pastel.lemon", transform: "scale(1.06)" },
            })}
          >
            <span
              style={{
                display: "inline-block", width: 12, height: 12, borderRadius: "50%",
                backgroundColor: `#${item.colorHex}`, marginRight: 6, verticalAlign: "middle",
              }}
            />
            {item.name} ({item.price}G)
          </button>
        ))}
      </div>

      {/* 持ち物パネル */}
      <div
        style={{ position: "absolute", bottom: 16, left: 16, zIndex: 10, maxWidth: 340 }}
        className={css({ bg: "pastel.sky", borderRadius: "12px", p: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" })}
      >
        <p style={{ fontSize: 12, color: "#6b5b73", margin: "0 0 6px" }}>持ち物</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ownedMaterials.length === 0
            ? <span style={{ fontSize: 12, color: "#999" }}>なし</span>
            : ownedMaterials.map(([id, count]) => {
              const mat = MATERIALS.find((m) => m.id === id);
              return mat ? (
                <span key={id} className={css({ bg: "white", borderRadius: "6px", px: "8px", py: "3px", fontSize: "12px", color: "#4a3f55" })}>
                  {mat.name} ×{count}
                </span>
              ) : null;
            })}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 10, display: "flex", gap: 8 }}>
        <button
          onClick={() => setIsRecipeOpen(true)}
          className={css({ bg: "pastel.lilac", border: "none", borderRadius: "10px", p: "10px 18px", cursor: "pointer", fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.12)", _hover: { bg: "pastel.lavender" } })}
        >
          レシピ帳
        </button>
        <button
          onClick={advanceScene}
          className={css({ bg: "pastel.peach", border: "none", borderRadius: "10px", p: "10px 18px", cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.12)", _hover: { bg: "pastel.pink" } })}
        >
          買い物を終える →
        </button>
      </div>

      {/* 共通レシピ帳ポップアップ */}
      <RecipeBookPopup
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
      />
    </div>
  );
}
