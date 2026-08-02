import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDefWithUrl, ReceiptItem } from '../../../data/types';
import { GOAL_MONEY, formatDayLabel } from '../../../data/constants';
import { css } from "#styled-system/css";

interface ShopMaterialItem extends MaterialDefWithUrl {
  instanceId: string;
}

interface ShopUIProps {
  money: number;
  day: number;
  shopItems: ShopMaterialItem[];
  quantities: Record<string, number>;
  soldOutItems: Record<string, boolean>;
  totalCost: number;
  canBuy: boolean;
  currentRefreshCost: number;
  refreshCount: number;
  handleCardClick: (instanceId: string) => void;
  handleRefreshTap: () => void;
  setShowExitModal: (show: boolean) => void;
  setQuantities: (quantities: Record<string, number>) => void;

  showExitModal: boolean;
  showRefreshModal: boolean;
  setShowRefreshModal: (show: boolean) => void;
  receiptItems: ReceiptItem[];
  onPurchase: () => void;
  onRefresh: () => void;
  onExit: () => void;
}

export default function ShopUI({
  money,
  day,
  shopItems,
  quantities,
  soldOutItems,
  totalCost,
  canBuy,
  currentRefreshCost,
  refreshCount,
  handleCardClick,
  handleRefreshTap,
  setShowExitModal,
  setQuantities,
  showExitModal,
  showRefreshModal,
  setShowRefreshModal,
  receiptItems,
  onPurchase,
  onRefresh,
  onExit,
}: ShopUIProps) {
  const firstRowItems = shopItems.slice(0, 3);
  const secondRowItems = shopItems.slice(3, 5);
  const hasSelectedItems = shopItems.some((item) => (quantities[item.instanceId] ?? 0) > 0);

  const selectableItems = shopItems.filter((item) => !soldOutItems[item.instanceId]);
  const allSelected = selectableItems.length > 0 && selectableItems.every((item) => quantities[item.instanceId] === 1);

  const handleSelectAll = () => {
    if (allSelected) {
      setQuantities({});
      return;
    }

    const next: Record<string, number> = {};
    selectableItems.forEach((item) => {
      next[item.instanceId] = 1;
    });
    setQuantities(next);
  };

  const receiptBaseItems = receiptItems.filter((item) => item.category === "base");
  const receiptAccentItems = receiptItems.filter((item) => item.category === "accent");
  const receiptTotal = receiptItems.reduce((sum, item) => sum + item.price, 0);

  const modalOverlayStyle = css({
    position: "absolute",
    inset: 0,
    bg: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  });

  const modalContentStyle = css({
    bg: "rgba(12,8,3,0.98)",
    borderRadius: "12px",
    p: "32px",
    w: "520px",
    textAlign: "center",
    boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
    border: "4px solid #8B6914",
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px" })}>
      <div className={css({ position: "relative", bg: "rgba(30,20,8,0.96)", color: "#c8a84b", border: "2px solid #8B6914", fontSize: "42px", fontWeight: "bold", pl: "160px", pr: "160px", pt: "14px", pb: "14px", borderRadius: "10px", mb: "20px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}>
        素材ショップ
      </div>

      <div className={css({ position: "relative", bg: "rgba(12,8,3,0.96)", border: "6px solid #8B6914", borderRadius: "12px", w: "95%", maxW: "1020px", h: "700px", p: "45px 35px 30px 35px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)", display: "flex", flexDirection: "column", justifyContent: "space-between" })}>
        <button
          onClick={handleRefreshTap}
          disabled={hasSelectedItems}
          className={css({ position: "absolute", top: "28px", left: "28px", background: "none", border: "none", color: "#c8a84b", zIndex: 5, transition: "transform 0.2s, opacity 0.2s", cursor: "pointer", _hover: { transform: "rotate(45deg)", color: "#e8d8b8" } })}
          style={{ opacity: hasSelectedItems ? 0.25 : 1, cursor: hasSelectedItems ? "not-allowed" : "pointer" }}
        >
          <IconRefresh size={52} />
        </button>

        <div className={css({ display: "flex", flexDirection: "column", gap: "28px", alignItems: "center", justifyContent: "center", flex: 1 })}>
          <div className={css({ display: "flex", justifyContent: "center", gap: "32px", w: "100%" })}>
            {firstRowItems.map((item) => (
              <ShopCard
                key={item.instanceId}
                item={item}
                isSelected={!!quantities[item.instanceId]}
                isSoldOut={!!soldOutItems[item.instanceId]}
                onClick={() => handleCardClick(item.instanceId)}
              />
            ))}
          </div>
          <div className={css({ display: "flex", justifyContent: "center", gap: "32px", w: "100%" })}>
            {secondRowItems.map((item) => (
              <ShopCard
                key={item.instanceId}
                item={item}
                isSelected={!!quantities[item.instanceId]}
                isSoldOut={!!soldOutItems[item.instanceId]}
                onClick={() => handleCardClick(item.instanceId)}
              />
            ))}
          </div>
        </div>

        <ShopActionBar
          totalCost={totalCost}
          canBuy={canBuy}
          setShowExitModal={setShowExitModal}
          onPurchase={onPurchase}
          onSelectAll={handleSelectAll}
          allSelected={allSelected}
          canSelectAll={selectableItems.length > 0}
        />
      </div>

      {showRefreshModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            {money < currentRefreshCost ? (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#d87872", lineHeight: "1.6" })}>
                  所持金が不足しています<br />
                  <span className={css({ fontSize: "18px", color: "#e8d8b8" })}>{refreshCount}回目の入れ替えには {currentRefreshCost}G 必要です</span>
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "#1a0e06", color: "#c8a84b", border: "1px solid #8B6914", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
                </div>
              </>
            ) : (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#e8d8b8", lineHeight: "1.6" })}>
                  {refreshCount}回目、{currentRefreshCost}G減りますが<br />素材アイテムを入れ替えますか？
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "#1a0e06", color: "#c8a84b", border: "1px solid #8B6914", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
                  <button onClick={onRefresh} className={css({ bg: "#a6534f", color: "#fff4e0", border: "1px solid #d87872", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>入れ替える {currentRefreshCost}G</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showExitModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "24px", fontWeight: "900", mb: "18px", color: "#c8a84b", letterSpacing: "0.05em" })}>. 退店確認 .</p>

            <div className={css({ textAlign: "left", mb: "18px", bg: "#fafafa", borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "10px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", color: "#4a3321" })}>
                <span>進行状況</span>
                <span>{formatDayLabel(day)}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", color: "#4a3321" })}>
                <span>目標金額</span>
                <span>{GOAL_MONEY.toLocaleString()}G</span>
              </div>
            </div>

            <div className={css({ textAlign: "left", mb: "20px", bg: "#fff8e6", borderRadius: "12px", p: "16px" })}>
              <p className={css({ fontSize: "16px", fontWeight: "bold", color: "#7a4a2e", mb: "10px" })}>今回の購入レシート</p>

              {receiptItems.length > 0 ? (
                <div className={css({ display: "flex", gap: "12px", alignItems: "stretch" })}>
                  <div className={css({ flex: 1, minW: 0, display: "flex", flexDirection: "column" })}>
                    <span className={css({ alignSelf: "flex-start", fontSize: "13px", fontWeight: "bold", color: "#ff4d4f", bg: "#fff1f0", px: "8px", py: "2px", borderRadius: "4px", border: "1px solid #ffccc7" })}>【 Base 素材 】</span>
                    <div className={css({ mt: "8px", display: "flex", flexDirection: "column", gap: "6px", maxHeight: "220px", overflowY: "auto", pr: "6px" })}>
                      {receiptBaseItems.length > 0 ? (
                        receiptBaseItems.map((item) => (
                          <div key={item.id} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", fontSize: "15px", color: "#a8071a", fontWeight: "bold" })}>
                            <span className={css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{item.name}</span>
                            <span className={css({ flexShrink: 0 })}>{item.price}G</span>
                          </div>
                        ))
                      ) : (
                        <p className={css({ fontSize: "14px", color: "#999", margin: 0 })}>なし</p>
                      )}
                    </div>
                  </div>

                  <div className={css({ flex: 1, minW: 0, display: "flex", flexDirection: "column", borderLeft: "1px dashed #e0d3a8", pl: "12px" })}>
                    <span className={css({ alignSelf: "flex-start", fontSize: "13px", fontWeight: "bold", color: "#52c41a", bg: "#f6ffed", px: "8px", py: "2px", borderRadius: "4px", border: "1px solid #b7eb8f" })}>【 Accent 素材 】</span>
                    <div className={css({ mt: "8px", display: "flex", flexDirection: "column", gap: "6px", maxHeight: "220px", overflowY: "auto", pr: "6px" })}>
                      {receiptAccentItems.length > 0 ? (
                        receiptAccentItems.map((item) => (
                          <div key={item.id} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", fontSize: "15px", color: "#237804", fontWeight: "bold" })}>
                            <span className={css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{item.name}</span>
                            <span className={css({ flexShrink: 0 })}>{item.price}G</span>
                          </div>
                        ))
                      ) : (
                        <p className={css({ fontSize: "14px", color: "#999", margin: 0 })}>なし</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className={css({ fontSize: "15px", color: "#777", margin: 0 })}>今回の購入はありません</p>
              )}
            </div>

            <div className={css({ textAlign: "left", mb: "20px", bg: "#fafafa", borderRadius: "12px", p: "16px", display: "flex", flexDirection: "column", gap: "10px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ fontSize: "14px", fontWeight: "bold", color: "#777" })}>今回の購入合計</span>
                <span className={css({ fontSize: "18px", fontWeight: "900", color: "#ff4d4f" })}>{`${receiptTotal.toLocaleString()} G`}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ fontSize: "14px", fontWeight: "bold", color: "#777" })}>所持金残高</span>
                <span className={css({ fontSize: "18px", fontWeight: "900", color: "#4a3321" })}>{`${money.toLocaleString()} G`}</span>
              </div>
            </div>

            <p className={css({ fontSize: "18px", fontWeight: "bold", mb: "24px", color: "#e8d8b8" })}>ショップを退店しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowExitModal(false)} className={css({ bg: "#1a0e06", color: "#c8a84b", border: "1px solid #8B6914", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onExit} className={css({ bg: "#a6534f", color: "#fff4e0", border: "1px solid #d87872", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>退店する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
