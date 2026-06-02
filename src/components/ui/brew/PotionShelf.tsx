import { useState, useRef, useEffect } from "react";
import { css } from "#styled-system/css";
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
  const itemsRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (itemsRef.current) {
        setCanScroll(itemsRef.current.scrollHeight > itemsRef.current.clientHeight);
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [brewedPotions.length]);

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

      {/* ポーションアイテム。4個程度まで表示、それ以上はスクロール可能 */}
      <div
        ref={itemsRef}
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "540px",
          overflowY: "auto",
          position: "relative",
        })}
      >
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
            {/* カラーオーブ。colorHexが動的のためinline style */}
            <span style={{
              display: "block", flexShrink: 0,
              width: 64, height: 64, borderRadius: "50%",
              backgroundColor: `#${g.def.colorHex}`,
              boxShadow: `0 2px 20px #${g.def.colorHex}99`,
            }} />
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

      {/* スクロール可能な場合、下向き矢印を表示 */}
      {canScroll && (
        <div className={css({
          alignSelf: "center",
          mt: "8px",
          color: "#c8a84b",
          animation: "advanceBounce 1s ease-in-out infinite",
          opacity: 0.6,
        })}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}
    </div>
  );
}
