import { css } from "#styled-system/css";
import { useGameStore } from "../../../store/useGameStore";
import { getPotion } from "../../../data/gameData";
import type { PotionDef } from "../../../data/types";
import ColorOrb from "../common/ColorOrb";

interface ShelfGroup {
  def: PotionDef;
  level: number;
  sellPrice: number;
  count: number;
  key: string;
}

export default function PotionShelf() {
  const { brewedPotions } = useGameStore();

  const groups = Object.values(
    brewedPotions.reduce<Record<string, ShelfGroup>>((acc, p) => {
      const def = getPotion(p.potionId);
      if (!def) return acc;
      const key = `${p.potionId}-${p.level}`;
      if (!acc[key]) acc[key] = { def, level: p.level, sellPrice: p.sellPrice, count: 0, key };
      acc[key].count++;
      return acc;
    }, {})
  );

  if (groups.length === 0) return null;

  return (
    <div className={css({
      position: "absolute",
      right: "56px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      width: "440px",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    })}>
      {/* 棚タイトル */}
      <div className={css({ mb: "16px" })}>
        <p className={css({ fontSize: "32px", color: "#c8a84b", fontWeight: "bold", letterSpacing: "0.18em", m: "0 0 4px", textTransform: "uppercase" })}>
          在庫ポーション
        </p>
        <div className={css({ height: "2px", bg: "rgba(200,168,75,0.4)" })} />
      </div>

      {/* ポーションアイテム */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "540px", overflowY: "auto", paddingRight: "8px", scrollbarColor: "rgba(200,168,75,0.5) transparent", scrollbarWidth: "thin" })}>
        {groups.map((g, i) => (
          <div
            key={g.key}
            // animationのdelayがiによって動的のためinline styleを使用
            style={{ animation: `shelfSlideIn 0.38s ease ${i * 60}ms both` }}
            className={css({
              display: "flex", alignItems: "center", gap: "16px",
              p: "16px 20px",
              bg: "rgba(8,6,18,0.92)",
              border: "1.5px solid rgba(200,168,75,0.3)",
              borderRadius: "14px",
            })}
          >
            <ColorOrb colorHex={g.def.colorHex} image={g.def.image} size={64} />
            {/* テキスト */}
            <div className={css({ flex: 1, minWidth: 0 })}>
              <p className={css({ fontSize: "32px", color: "#ffffff", m: 0, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>
                {g.def.name}
              </p>
              <p className={css({ fontSize: "26px", color: "#c8a84b", fontWeight: "bold", m: 0 })}>
                Lv.{g.level} / {g.sellPrice}G
              </p>
            </div>
            {/* 個数バッジ */}
            {g.count > 1 && (
              <span
                // animationのトリガーのためinline style
                style={{ animation: "shelfBadgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
                className={css({
                  fontSize: "28px", fontWeight: "bold", color: "#ffffff",
                  bg: "#c8a84b",
                  borderRadius: "24px", px: "14px", py: "4px",
                  flexShrink: 0,
                  boxShadow: "0 2px 10px rgba(200,168,75,0.4)",
                })}
              >
                ×{g.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
