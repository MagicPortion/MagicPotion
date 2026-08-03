import { css } from "#styled-system/css";
import { SEMANTIC } from "../dialogue/dialogueThemes";
import { useUITheme } from "../../../hooks/useUITheme";

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
  const t = useUITheme();

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
          style={{ background: t.surface, borderColor: t.border }}
          className={css({
            px: "20px",
            py: "10px",
            border: "1px solid",
            borderRadius: "8px",
            minW: "140px",
            textAlign: "center",
          })}
        >
          <span
            style={{ color: t.text }}
            className={css({
              fontSize: "12px",
              display: "block",
              fontWeight: "bold",
              mb: "2px",
            })}
          >
            合計金額
          </span>
          <span style={{ color: t.nameText }} className={css({ fontSize: "24px", fontWeight: "bold" })}>
            {totalCost === 0 ? "- -" : totalCost} G
          </span>
        </div>
        <button
          onClick={onSelectAll}
          disabled={!canSelectAll}
          className={css({
            order: 2,
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            _hover: { filter: "brightness(1.15)" },
          })}
          style={{
            color: canSelectAll ? t.surface : SEMANTIC.disabledText,
            background: canSelectAll ? t.nameText : SEMANTIC.disabled,
            border: `1px solid ${SEMANTIC.accentBright}`,
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
            px: "56px",
            py: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
            transition: "filter 0.2s",
            _hover: { filter: "brightness(1.15)" },
          })}
          style={{
            color: canBuy ? t.surface : SEMANTIC.disabledText,
            background: canBuy ? t.nameText : SEMANTIC.disabled,
            border: `1px solid ${SEMANTIC.accentBright}`,
            cursor: canBuy ? "pointer" : "not-allowed",
          }}
        >
          購入
        </button>
      </div>

      <button
        onClick={() => setShowExitModal(true)}
        className={css({
          px: "52px",
          py: "16px",
          fontSize: "22px",
          fontWeight: "bold",
          cursor: "pointer",
          clipPath: "polygon(0% 0%, 82% 0%, 100% 100%, 18% 100%)",
          transition: "filter 0.2s",
          _hover: { filter: "brightness(1.3)" },
        })}
        style={{ background: t.surface, color: t.nameText, border: `1px solid ${t.nameText}` }}
      >
        退店する
      </button>
    </div>
  );
}
