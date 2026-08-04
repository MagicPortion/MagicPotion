import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDefWithUrl, ReceiptItem } from '../../../data/types';
import { GOAL_MONEY, formatDayLabel } from '../../../data/constants';
import { SEMANTIC } from '../dialogue/dialogueThemes';
import { useUITheme } from '../../../hooks/useUITheme';
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

// レア度順（出現確率が低い = spawnWeightが小さいほどレア度が高い）に並べる
function sortByRarity(items: ReceiptItem[]): ReceiptItem[] {
  return [...items].sort((a, b) => a.spawnWeight - b.spawnWeight);
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
  const t = useUITheme();
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

  const receiptBaseItems = sortByRarity(receiptItems.filter((item) => item.category === "base"));
  const receiptAccentItems = sortByRarity(receiptItems.filter((item) => item.category === "accent"));
  const receiptTotal = receiptItems.reduce((sum, item) => sum + item.price, 0);

  const modalOverlayStyle = css({
    position: "absolute",
    inset: 0,
    bg: "parchment.overlay",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  });

  // 品揃え更新モーダル（ショップ本体と同じ、設定中の背景テーマに追従）
  const modalContentClass = css({
    borderRadius: "12px",
    p: "32px",
    w: "520px",
    textAlign: "center",
    boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
    border: "4px solid",
  });

  // 退店確認（購入レシート）モーダルはクリーム系の「レシート」テーマに固定
  // クレジット画面の羊皮紙表現（二重線・斜めグラデーション・内枠）を、
  // レシートらしいクリーム系の紙質感として流用している
  const receiptModalStyle = css({
    position: "relative",
    background: "linear-gradient(100deg, #fdf2d9 0%, #fffaf0 20%, #fff8e6 55%, #fbeecb 85%, #f3e2ba 100%)",
    borderRadius: "10px",
    p: "40px 44px",
    w: "900px",
    textAlign: "center",
    boxShadow: "0 20px 96px rgba(0,0,0,0.5), inset 0 0 44px rgba(122,74,16,0.14)",
    // ゲーム全体をtransform: scale()で縮小表示する都合上、border-style: doubleは
    // 線と線の間がサブピクセルでガタつき上端などが欠けて見えることがあるため、solid+内枠で代用する
    border: "3px solid",
    borderColor: "receipt.border",
    _before: {
      content: "''",
      position: "absolute",
      inset: "10px",
      border: "1px solid rgba(122,74,16,0.35)",
      pointerEvents: "none",
    },
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px" })}>
      <div
        style={{ background: t.bgSoft, color: t.nameText, borderColor: t.border }}
        className={css({ position: "relative", border: "2px solid", fontSize: "42px", fontWeight: "bold", pl: "160px", pr: "160px", pt: "14px", pb: "14px", borderRadius: "10px", mb: "20px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}
      >
        素材ショップ
      </div>

      <div
        style={{ background: t.bg, borderColor: t.border }}
        className={css({ position: "relative", border: "6px solid", borderRadius: "12px", w: "95%", maxW: "1020px", h: "700px", p: "45px 35px 30px 35px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)", display: "flex", flexDirection: "column", justifyContent: "space-between" })}
      >
        <button
          onClick={handleRefreshTap}
          disabled={hasSelectedItems}
          className={css({ position: "absolute", top: "28px", left: "28px", background: "none", border: "none", zIndex: 5, transition: "transform 0.2s, opacity 0.2s", _hover: { transform: "rotate(45deg)" } })}
          style={{ color: t.nameText, opacity: hasSelectedItems ? 0.25 : 1, cursor: hasSelectedItems ? "not-allowed" : "pointer" }}
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
          <div className={modalContentClass} style={{ background: t.bg, borderColor: t.border }}>
            {money < currentRefreshCost ? (
              <>
                <p className={css({ fontSize: "24px", fontWeight: "bold", mb: "24px", lineHeight: "1.6" })} style={{ color: SEMANTIC.dangerBorder }}>
                  所持金が不足しています<br />
                  <span className={css({ fontSize: "22px" })} style={{ color: t.text }}>{refreshCount}回目の入れ替えには {currentRefreshCost}G 必要です</span>
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ border: "1px solid", px: "32px", py: "12px", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", cursor: "pointer" })} style={{ background: t.surface, color: t.nameText, borderColor: t.border }}>戻る</button>
                </div>
              </>
            ) : (
              <>
                <p className={css({ fontSize: "24px", fontWeight: "bold", mb: "24px", lineHeight: "1.6" })} style={{ color: t.text }}>
                  {refreshCount}回目、{currentRefreshCost}G減りますが<br />素材アイテムを入れ替えますか？
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ border: "1px solid", px: "32px", py: "12px", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", cursor: "pointer" })} style={{ background: t.surface, color: t.nameText, borderColor: t.border }}>戻る</button>
                  <button onClick={onRefresh} className={css({ border: "1px solid", px: "32px", py: "12px", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", cursor: "pointer" })} style={{ background: SEMANTIC.danger, color: SEMANTIC.dangerText, borderColor: SEMANTIC.dangerBorder }}>入れ替える {currentRefreshCost}G</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showExitModal && (
        <div className={modalOverlayStyle}>
          <div className={receiptModalStyle}>
            <p className={css({ fontSize: "32px", fontWeight: "900", mb: "24px", color: "receipt.text", letterSpacing: "0.05em" })}>. 退店確認 .</p>

            <div className={css({ textAlign: "left", mb: "20px", bg: "receipt.bgSoft", borderRadius: "12px", p: "20px", display: "flex", flexDirection: "column", gap: "12px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", color: "receipt.text", fontSize: "26px" })}>
                <span>進行状況</span>
                <span>{formatDayLabel(day)}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", color: "receipt.text", fontSize: "26px" })}>
                <span>目標金額</span>
                <span>{GOAL_MONEY.toLocaleString()}G</span>
              </div>
            </div>

            <div className={css({ textAlign: "left", mb: "20px", bg: "receipt.bg", border: "1px dashed", borderColor: "receipt.border", borderRadius: "12px", p: "20px" })}>
              <p className={css({ fontSize: "24px", fontWeight: "bold", color: "receipt.border", mb: "14px" })}>今回の購入レシート</p>

              {receiptItems.length > 0 ? (
                <div className={css({ display: "flex", gap: "16px", alignItems: "stretch" })}>
                  <div className={css({ flex: 1, minW: 0, display: "flex", flexDirection: "column" })}>
                    <span className={css({ alignSelf: "flex-start", fontSize: "22px", fontWeight: "bold", color: "receipt.base", bg: "receipt.baseBg", px: "10px", py: "3px", borderRadius: "4px", border: "1px solid", borderColor: "receipt.baseBorder" })}>【 Base 素材 】</span>
                    <div className={css({ mt: "10px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto", pr: "6px" })}>
                      {receiptBaseItems.length > 0 ? (
                        receiptBaseItems.map((item) => (
                          <div key={item.id} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", fontSize: "24px", color: "receipt.baseText", fontWeight: "bold" })}>
                            <span className={css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{item.name}</span>
                            <span className={css({ flexShrink: 0 })}>{item.price}G</span>
                          </div>
                        ))
                      ) : (
                        <p className={css({ fontSize: "24px", color: "receipt.textMuted", margin: 0 })}>なし</p>
                      )}
                    </div>
                  </div>

                  <div className={css({ flex: 1, minW: 0, display: "flex", flexDirection: "column", borderLeft: "1px dashed", borderColor: "receipt.border", pl: "16px" })}>
                    <span className={css({ alignSelf: "flex-start", fontSize: "22px", fontWeight: "bold", color: "receipt.accentItem", bg: "receipt.accentItemBg", px: "10px", py: "3px", borderRadius: "4px", border: "1px solid", borderColor: "receipt.accentItemBorder" })}>【 Accent 素材 】</span>
                    <div className={css({ mt: "10px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto", pr: "6px" })}>
                      {receiptAccentItems.length > 0 ? (
                        receiptAccentItems.map((item) => (
                          <div key={item.id} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", fontSize: "24px", color: "receipt.accentItemText", fontWeight: "bold" })}>
                            <span className={css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{item.name}</span>
                            <span className={css({ flexShrink: 0 })}>{item.price}G</span>
                          </div>
                        ))
                      ) : (
                        <p className={css({ fontSize: "24px", color: "receipt.textMuted", margin: 0 })}>なし</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className={css({ fontSize: "24px", color: "receipt.textMuted", margin: 0 })}>今回の購入はありません</p>
              )}
            </div>

            <div className={css({ textAlign: "left", mb: "24px", bg: "receipt.bgSoft", borderRadius: "12px", p: "20px", display: "flex", flexDirection: "column", gap: "12px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ fontSize: "24px", fontWeight: "bold", color: "receipt.textMuted" })}>今回の購入合計</span>
                <span className={css({ fontSize: "26px", fontWeight: "900", color: "receipt.base" })}>{`${receiptTotal.toLocaleString()} G`}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ fontSize: "24px", fontWeight: "bold", color: "receipt.textMuted" })}>所持金残高</span>
                <span className={css({ fontSize: "26px", fontWeight: "900", color: "receipt.text" })}>{`${money.toLocaleString()} G`}</span>
              </div>
            </div>

            <p className={css({ fontSize: "26px", fontWeight: "bold", mb: "24px", color: "receipt.text" })}>ショップを退店しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowExitModal(false)} className={css({ bg: "receipt.cancelBg", color: "receipt.cancelText", border: "none", px: "36px", py: "14px", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onExit} className={css({ bg: "receipt.base", color: "receipt.confirmText", border: "none", px: "36px", py: "14px", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", cursor: "pointer" })}>退店する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
