import { css } from "../../../../styled-system/css";
import { useGameStore } from "../../../store/useGameStore";
import { getPotion } from "../../../data/gameData";
import type { PotionDef } from "../../../data/types";

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
      width: "280px",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    })}>
      {/* 棚タイトル */}
      <div className={css({ mb: "16px" })}>
        <p className={css({ fontSize: "14px", color: "#5a4a80", letterSpacing: "0.18em", m: "0 0 4px", textTransform: "uppercase" })}>
          在庫ポーション
        </p>
        <div className={css({ height: "1px", bg: "rgba(200,168,75,0.25)" })} />
      </div>

      {/* ポーションアイテム */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "10px" })}>
        {groups.map((g, i) => (
          <div
            key={g.key}
            // animationのdelayがiによって動的のためinline style
            style={{ animation: `shelfSlideIn 0.38s ease ${i * 60}ms both` }}
            className={css({
              display: "flex", alignItems: "center", gap: "16px",
              p: "14px 18px",
              bg: "rgba(8,6,18,0.88)",
              border: "1px solid rgba(200,168,75,0.18)",
              borderRadius: "12px",
            })}
          >
            {/* カラーオーブ。colorHexが動的のためinline style */}
            <span style={{
              display: "block", flexShrink: 0,
              width: 52, height: 52, borderRadius: "50%",
              backgroundColor: `#${g.def.colorHex}`,
              boxShadow: `0 2px 16px #${g.def.colorHex}77`,
            }} />
            {/* テキスト */}
            <div className={css({ flex: 1, minWidth: 0 })}>
              <p className={css({ fontSize: "16px", color: "#e8d8b8", m: 0, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>
                {g.def.name}
              </p>
              <p className={css({ fontSize: "13px", color: "#6b5b73", m: 0 })}>
                Lv.{g.level} / {g.sellPrice}G
              </p>
            </div>
            {/* 個数バッジ */}
            {g.count > 1 && (
              <span
                style={{ animation: "shelfBadgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
                className={css({
                  fontSize: "16px", fontWeight: "bold", color: "#c8a84b",
                  bg: "rgba(200,168,75,0.12)",
                  border: "1px solid rgba(200,168,75,0.3)",
                  borderRadius: "24px", px: "12px", py: "4px",
                  flexShrink: 0,
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
