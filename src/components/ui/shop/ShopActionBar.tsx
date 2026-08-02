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
            bg: "#1e1408",
            px: "20px",
            py: "10px",
            border: "1px solid #8B6914",
            borderRadius: "8px",
            minW: "140px",
            textAlign: "center",
          })}
        >
          <span
            className={css({
              fontSize: "12px",
              color: "#e8d8b8",
              display: "block",
              fontWeight: "bold",
              mb: "2px",
            })}
          >
            合計金額
          </span>
          <span className={css({ fontSize: "24px", fontWeight: "bold", color: "#c8a84b" })}>
            {totalCost === 0 ? "- -" : totalCost} G
          </span>
        </div>
        <button
          onClick={onSelectAll}
          disabled={!canSelectAll}
          className={css({
            order: 2,
            color: "#1a0e06",
            border: "1px solid #e0c56f",
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            cursor: "pointer",
            _hover: { filter: "brightness(1.15)" },
          })}
          style={{
            backgroundColor: canSelectAll ? "#c8a84b" : "#4a4238",
            color: canSelectAll ? "#1a0e06" : "#7a6655",
            cursor: canSelectAll ? "pointer" : "not-allowed",
          }}
        >
          {allSelected ? "全解除" : "全選択"}
        </button>
        <button
          onClick={onPurchase}
          disabled={!canBuy}
          className={css({
            order: 1,
            color: "#1a0e06",
            border: "1px solid #e0c56f",
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            cursor: "pointer",
            _hover: { filter: "brightness(1.15)" },
          })}
          style={{
            backgroundColor: canBuy ? "#c8a84b" : "#4a4238",
            color: canBuy ? "#1a0e06" : "#7a6655",
            cursor: canBuy ? "pointer" : "not-allowed",
          }}
        >
          購入
        </button>
      </div>

      <button
        onClick={() => setShowExitModal(true)}
        className={css({
          bg: "#1a0e06",
          color: "#c8a84b",
          border: "1px solid #c8a84b",
          px: "52px",
          py: "16px",
          fontSize: "22px",
          fontWeight: "bold",
          cursor: "pointer",
          clipPath: "polygon(0% 0%, 82% 0%, 100% 100%, 18% 100%)",
          _hover: { bg: "#2a1d0c", color: "#e8d8b8" },
        })}
      >
        退店する
      </button>
    </div>
  );
}
