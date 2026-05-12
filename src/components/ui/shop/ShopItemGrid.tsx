import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";
import IconRefresh from "../icons/IconRefresh";

interface ShopItemGridProps {
  items: MaterialDef[];
  shopLevel: number;
  onBuy: (item: MaterialDef) => void;
  onRefresh: () => void;
  illustrationSrc?: string;
}

export default function ShopItemGrid({ items, shopLevel, onBuy, onRefresh, illustrationSrc }: ShopItemGridProps) {
  return (
    <div
      style={{ position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, width: "86%", maxWidth: 980, minHeight: 440 }}
      className={css({
        position: "relative",
        bg: "pastel.lemon",
        borderRadius: "28px",
        p: "24px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        overflow: "hidden",
      })}
    >
      {illustrationSrc && (
        <img
          src={illustrationSrc}
          alt="ショップイラスト"
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: "380px",
            opacity: 0.18,
            pointerEvents: "none",
            filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.08))",
          }}
        />
      )}

      <div className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "20px" })}>
        <button
          type="button"
          onClick={onRefresh}
          className={css({
            width: "52px", height: "52px", display: "inline-flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: "2px solid", borderColor: "pastel.sage",
            bg: "white", color: "#4a3f55", cursor: "pointer", transition: "all 0.15s",
            _hover: { bg: "pastel.lemon" },
          })}
        >
          <IconRefresh size={24} />
        </button>

        <div style={{ textAlign: "center", flex: 1 }}>
          <p className={css({ margin: 0, fontSize: "30px", fontWeight: "900", color: "#4a3f55" })}>材料ショップ</p>
          <p className={css({ margin: "8px 0 0", fontSize: "15px", color: "#6b5b73" })}>店レベル {shopLevel}</p>
        </div>

        <div style={{ width: "52px", height: "52px" }} />
      </div>

      <div className={css({
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "18px",
      })}>
        {items.map((item) => (
          <div
            key={item.id}
            className={css({
              flex: "0 0 260px",
              maxWidth: "260px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "220px",
              bg: "white",
              borderRadius: "22px",
              border: "2px solid",
              borderColor: "pastel.sage",
              p: "18px",
              boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
              backdropFilter: "blur(4px)",
            })}
          >
            <div>
              <div className={css({ display: "flex", alignItems: "center", gap: "12px", mb: "12px" })}>
                <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: "50%", backgroundColor: `#${item.colorHex}` }} />
                <span className={css({ fontSize: "20px", fontWeight: "900", color: "#3e3848" })}>{item.name}</span>
              </div>
              <p className={css({ margin: 0, fontSize: "15px", color: "#6b5b73" })}>{item.category === "base" ? "ベース素材" : "アクセント素材"}</p>
            </div>

            <div>
              <p className={css({ margin: "0 0 12px", fontSize: "15px", color: "#4e3f5a" })}>価格 {item.price}G</p>
              <button
                type="button"
                onClick={() => onBuy(item)}
                className={css({
                  width: "100%", py: "14px", borderRadius: "18px", border: "none",
                  bg: "pastel.sky", color: "#3e3848", fontWeight: "900", cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)", transition: "all 0.18s", _hover: { bg: "pastel.lemon" },
                })}
              >
                購入する
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
