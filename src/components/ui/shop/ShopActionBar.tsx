import { css } from "#styled-system/css";

interface ShopActionBarProps {
  totalCost: number;
  canBuy: boolean;
  setShowExitModal: (show: boolean) => void;
  onPurchase: () => void;
  onSelectAll: () => void;
  allSelected: boolean;
  canSelectAll: boolean;
}

export default function ShopActionBar({
  totalCost,
  canBuy,
  setShowExitModal,
  onPurchase,
  onSelectAll,
  allSelected,
  canSelectAll,
}: ShopActionBarProps) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        w: "100%",
        mt: "24px",
        zIndex: 1,
        position: "relative",
      })}
    >
      <div className={css({ display: "flex", alignItems: "center", gap: "24px" })}>
        <div
          className={css({
            bg: "parchment.surfaceSoft",
            px: "20px",
            py: "10px",
            border: "1px solid",
            borderColor: "parchment.border",
            borderRadius: "8px",
            minW: "140px",
            textAlign: "center",
          })}
        >
          <span
            className={css({
              fontSize: "12px",
              color: "parchment.text",
              display: "block",
              fontWeight: "bold",
              mb: "2px",
            })}
          >
            合計金額
          </span>
          <span className={css({ fontSize: "24px", fontWeight: "bold", color: "parchment.accent" })}>
            {totalCost === 0 ? "- -" : totalCost} G
          </span>
        </div>
        <button
          onClick={onSelectAll}
          disabled={!canSelectAll}
          className={css({
            order: 2,
            color: canSelectAll ? "parchment.surface" : "parchment.disabledText",
            bg: canSelectAll ? "parchment.accent" : "parchment.disabled",
            border: "1px solid",
            borderColor: "parchment.accentBright",
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: canSelectAll ? "pointer" : "not-allowed",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            _hover: { filter: "brightness(1.15)" },
          })}
        >
          {allSelected ? "全解除" : "全選択"}
        </button>
        <button
          onClick={onPurchase}
          disabled={!canBuy}
          className={css({
            order: 1,
            color: canBuy ? "parchment.surface" : "parchment.disabledText",
            bg: canBuy ? "parchment.accent" : "parchment.disabled",
            border: "1px solid",
            borderColor: "parchment.accentBright",
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: canBuy ? "pointer" : "not-allowed",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            _hover: { filter: "brightness(1.15)" },
          })}
        >
          購入
        </button>
      </div>

      <button
        onClick={() => setShowExitModal(true)}
        className={css({
          bg: "parchment.surface",
          color: "parchment.accent",
          border: "1px solid",
          borderColor: "parchment.accent",
          px: "52px",
          py: "16px",
          fontSize: "22px",
          fontWeight: "bold",
          cursor: "pointer",
          clipPath: "polygon(0% 0%, 82% 0%, 100% 100%, 18% 100%)",
          _hover: { bg: "parchment.surfaceHover", color: "parchment.text" },
        })}
      >
        退店する
      </button>
    </div>
  );
}
