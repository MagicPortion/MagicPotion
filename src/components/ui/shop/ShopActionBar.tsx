import { css } from "#styled-system/css";

interface ShopActionBarProps {
  totalCost: number;
  canBuy: boolean;
  hasSelectedItems: boolean;
  setShowBuyModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  onPurchase: () => void;
  onClear: () => void;
}

export default function ShopActionBar({ totalCost, canBuy, hasSelectedItems, setShowBuyModal, setShowExitModal, onPurchase, onClear }: ShopActionBarProps) {
  return (
    <div className={css({
      display: "flex",
      justifyContent: "space-between", // ★ justify を正式名称に修正
      alignItems: "center",
      bg: "rgba(0, 0, 0, 0.15)",
      borderRadius: "16px",
      py: "16px",
      px: "36px",
      mt: "24px",
      zIndex: 1,
      position: "relative"
    })}>
      <div className={css({ display: "flex", alignItems: "center", gap: "24px" })}>
        <div className={css({ bg: "white", px: "20px", py: "10px", border: "1px solid #ccc", minW: "140px", textAlign: "center" })}>
          <span className={css({ fontSize: "12px", color: "#555", display: "block", fontWeight: "bold", mb: "2px" })}>合計</span>
          <span className={css({ fontSize: "24px", fontWeight: "bold", color: "#111" })}>{totalCost === 0 ? "- -" : totalCost} - G</span>
        </div>
        <button
          onClick={onPurchase} disabled={!canBuy}
          className={css({ color: "#002766", border: "none", px: "56px", py: "16px", fontSize: "24px", fontWeight: "bold", clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)", transition: "opacity 0.2s", cursor: "pointer", _hover: { opacity: 0.9 } })}
          style={{ backgroundColor: canBuy ? "#5bc0f8" : "#bfbfbf", cursor: canBuy ? "pointer" : "not-allowed" }}
        >購入</button>
      </div>
      {hasSelectedItems && <button onClick={onClear} className={css({ fontSize: "15px", color: "white", bg: "none", border: "none", cursor: "pointer", textDecoration: "underline", opacity: 0.8 })}>クリア</button>}
      <button onClick={() => setShowExitModal(true)} className={css({ bg: "#5bc0f8", color: "#002766", border: "none", px: "52px", py: "16px", fontSize: "22px", fontWeight: "bold", cursor: "pointer", clipPath: "polygon(0% 0%, 82% 0%, 100% 100%, 18% 100%)" })}>退店する</button>
    </div>
  );
}