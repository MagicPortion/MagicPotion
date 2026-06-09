import { css } from "#styled-system/css";
import type { BrewedPotion } from "../../../data/types";
import { getPotion } from "../../../data/gameData";
import ColorOrb from "../common/ColorOrb";
import NewBadge from "../common/NewBadge";

interface SaleResultPopupProps {
  potions: BrewedPotion[];
  onClose: () => void;
}

interface PotionGroup {
  potionId: string;
  name: string;
  colorHex: string;
  level: number;
  count: number;
  total: number;
  hasNew: boolean;
}

function groupPotions(potions: BrewedPotion[]): PotionGroup[] {
  const map = new Map<string, PotionGroup>();
  for (const p of potions) {
    const def = getPotion(p.potionId);
    if (!def) continue;
    const key = `${p.potionId}__lv${p.level}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.total += p.sellPrice;
      if (p.isNew) existing.hasNew = true;
    } else {
      map.set(key, {
        potionId: p.potionId,
        name: def.name,
        colorHex: def.colorHex,
        level: p.level,
        count: 1,
        total: p.sellPrice,
        hasNew: p.isNew,
      });
    }
  }
  return Array.from(map.values());
}

export default function SaleResultPopup({ potions, onClose }: SaleResultPopupProps) {
  const groups = groupPotions(potions);
  const grandTotal = potions.reduce((sum, p) => sum + p.sellPrice, 0);

  return (
    <div
      className={css({
        position: "absolute", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        bg: "rgba(0,0,0,0.85)",
      })}
    >
      <div
        className={css({
          bg: "rgba(18,18,36,0.97)",
          border: "2px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          p: "56px 64px",
          minW: "640px",
          maxW: "820px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        })}
        // salePopupIn: ポップアップ出現アニメーションのためinline style
        style={{ animation: "salePopupIn 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <h2
          className={css({
            m: 0, textAlign: "center", letterSpacing: "0.08em",
            color: "rgba(255,220,100,1)", fontSize: "44px",
          })}
        >
          本日の売上
        </h2>

        {potions.length === 0 ? (
          <p className={css({ textAlign: "center", color: "rgba(255,255,255,0.6)", m: 0, fontSize: "32px" })}>
            今日は何も作りませんでした
          </p>
        ) : (
          <div className={css({ display: "flex", flexDirection: "column", gap: "20px" })}>
            {groups.map((g) => (
              <div
                key={`${g.potionId}__lv${g.level}`}
                className={css({
                  display: "flex", alignItems: "center", gap: "20px",
                  bg: "rgba(255,255,255,0.05)", borderRadius: "14px",
                  p: "16px 24px", position: "relative",
                })}
              >
                <ColorOrb colorHex={g.colorHex} size={64} />

                <div className={css({ flex: 1, display: "flex", flexDirection: "column", gap: "8px" })}>
                  <span className={css({ fontWeight: "700", color: "white", fontSize: "32px" })}>
                    {g.name}
                  </span>
                  <div className={css({ display: "flex", alignItems: "center", gap: "12px" })}>
                    <span
                      className={css({
                        bg: "rgba(200,168,75,0.25)", border: "1px solid #c8a84b",
                        borderRadius: "20px", px: "12px", py: "4px",
                        fontSize: "28px", fontWeight: "900", color: "#ffd700",
                        whiteSpace: "nowrap", letterSpacing: "-0.02em",
                      })}
                    >
                      Lv.{g.level}
                    </span>
                    <span className={css({ color: "rgba(255,255,255,0.65)", fontSize: "28px" })}>
                      &times; {g.count}本
                    </span>
                  </div>
                </div>

                <span className={css({ fontWeight: "700", color: "rgba(100,230,160,1)", letterSpacing: "0.04em", fontSize: "34px" })}>
                  +{g.total}G
                </span>

                {g.hasNew && (
                  <div className={css({ position: "absolute", top: "-14px", right: "16px" })}>
                    <NewBadge />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {potions.length > 0 && (
          <div
            className={css({
              display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px",
              borderTop: "1px solid rgba(255,255,255,0.15)", pt: "24px",
            })}
          >
            <span className={css({ color: "rgba(255,255,255,0.6)", fontSize: "32px" })}>合計</span>
            <span className={css({ fontWeight: "900", color: "rgba(100,230,160,1)", letterSpacing: "0.04em", fontSize: "44px" })}>
              +{grandTotal}G
            </span>
          </div>
        )}

        <button
          onClick={onClose}
          className={css({
            alignSelf: "center",
            bg: "rgba(255,220,100,1)", color: "rgba(20,10,0,1)",
            border: "none", borderRadius: "14px",
            p: "18px 56px", fontSize: "34px",
            fontWeight: "900", cursor: "pointer",
            letterSpacing: "0.06em",
            transition: "transform 0.12s, filter 0.12s",
            _hover: { transform: "scale(1.04)", filter: "brightness(1.08)" },
          })}
        >
          翌朝へ &rarr;
        </button>
      </div>
    </div>
  );
}
