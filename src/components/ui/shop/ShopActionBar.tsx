import { css } from "#styled-system/css";

interface ShopActionBarProps {
  totalCost: number;
  canBuy: boolean;
  hasSelectedItems: boolean;
  setShowBuyModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  onClear: () => void;
}

export default function ShopActionBar({ totalCost, canBuy, hasSelectedItems, setShowBuyModal, setShowExitModal, onClear }: ShopActionBarProps) {
  return (
    <div className={css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      w: "100%",
      mt: "24px",
      zIndex: 1,
      position: "relative"
    })}>
      <div className={css({ display: "flex", alignItems: "center", gap: "24px" })}>
        <div className={css({ bg: "rgba(8,5,20,0.92)", px: "20px", py: "10px", border: "1px solid rgba(200,168,75,0.3)", borderRadius: "8px", minW: "140px", textAlign: "center" })}>
          <span className={css({ fontSize: "12px", color: "#e8d8b8", display: "block", fontWeight: "bold", mb: "2px" })}>合計金額</span>
          <span className={css({ fontSize: "24px", fontWeight: "bold", color: "#c8a84b" })}>{totalCost === 0 ? "- -" : totalCost} - G</span>
        </div>
        <button
          onClick={() => setShowBuyModal(true)} disabled={!canBuy}
          className={css({ color: "#1a0e06", border: "none", px: "56px", py: "16px", fontSize: "24px", fontWeight: "bold", clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)", transition: "filter 0.2s", cursor: "pointer", _hover: { filter: "brightness(1.15)" } })}
          style={{ backgroundColor: canBuy ? "#c8a84b" : "#4a4238", color: canBuy ? "#1a0e06" : "#7a6655", cursor: canBuy ? "pointer" : "not-allowed" }}
        >購入</button>
      </div>
      {hasSelectedItems && <button onClick={onClear} className={css({ fontSize: "15px", color: "white", bg: "none", border: "none", cursor: "pointer", textDecoration: "underline", opacity: 0.8 })}>クリア</button>}
      <button onClick={() => setShowExitModal(true)} className={css({ bg: "rgba(200,168,75,0.14)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.45)", px: "52px", py: "16px", fontSize: "22px", fontWeight: "bold", cursor: "pointer", clipPath: "polygon(0% 0%, 82% 0%, 100% 100%, 18% 100%)", _hover: { bg: "rgba(200,168,75,0.25)", color: "#e8d8b8" } })}>退店する</button>
    </div>
  );
}
