import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDef } from '../../../data/types';
import { css } from "#styled-system/css";

interface ShopMaterialItem extends MaterialDef {
  instanceId: string;
}

interface ShopUIProps {
  money: number;
  shopItems: ShopMaterialItem[];
  quantities: Record<string, number>;
  soldOutItems: Record<string, boolean>;
  totalCost: number;
  canBuy: boolean;
  currentRefreshCost: number;
  refreshCount: number;
  handleCardClick: (instanceId: string) => void;
  handleRefreshTap: () => void;
  setShowBuyModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  setQuantities: (quantities: Record<string, number>) => void;

  showBuyModal: boolean;
  showExitModal: boolean;
  showRefreshModal: boolean;
  setShowRefreshModal: (show: boolean) => void;
  onPurchase: () => void;
  onRefresh: () => void;
  onExit: () => void;
}


export default function ShopUI({
  money, shopItems, quantities, soldOutItems, totalCost, canBuy, currentRefreshCost, refreshCount,
  handleCardClick, handleRefreshTap, setShowBuyModal, setShowExitModal, setQuantities,
  showBuyModal, showExitModal, showRefreshModal, setShowRefreshModal, onPurchase, onRefresh, onExit
}: ShopUIProps) {
  const firstRowItems = shopItems.slice(0, 3);
  const secondRowItems = shopItems.slice(3, 5);
  const hasSelectedItems = shopItems.some((item) => (quantities[item.instanceId] ?? 0) > 0);

  const selectedBaseItems = shopItems.filter(item => quantities[item.instanceId] === 1 && item.category === "base");
  const selectedAccentItems = shopItems.filter(item => quantities[item.instanceId] === 1 && item.category === "accent");

  const modalOverlayStyle = css({
    position: "absolute",
    inset: 0,
    bg: "rgba(3, 2, 10, 0.78)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100
  });

  const modalContentStyle = css({
    bg: "rgba(8, 6, 18, 0.98)",
    borderRadius: "24px",
    p: "32px",
    w: "520px",
    textAlign: "center",
    boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
    border: "1px solid rgba(200,168,75,0.45)"
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px", zIndex: 20 })}>
      <div className={css({ position: "relative", bg: "rgba(8,6,18,0.93)", color: "#e8d8b8", border: "1px solid rgba(200,168,75,0.4)", fontSize: "42px", fontWeight: "bold", pl: "160px", pr: "160px", pt: "14px", pb: "14px", borderRadius: "10px", mb: "20px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}>
        <span style={{ position: "absolute", left: "40px", color: "#c8a84b" }}>◀</span>
        素材 ショップ
        <span style={{ position: "absolute", right: "40px", color: "#c8a84b" }}>▶</span>
      </div>
      <div className={css({ position: "relative", bg: "rgba(8,6,18,0.8)", border: "1px solid rgba(200,168,75,0.3)", borderRadius: "24px", w: "90%", maxW: "1160px", h: "710px", p: "45px 44px 46px 44px", boxShadow: "0 24px 80px rgba(0,0,0,0.65)", display: "flex", flexDirection: "column", justifyContent: "space-between", backdropFilter: "blur(2px)" })}>
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
        <ShopActionBar totalCost={totalCost} canBuy={canBuy} hasSelectedItems={hasSelectedItems} setShowBuyModal={setShowBuyModal} setShowExitModal={setShowExitModal} onClear={() => setQuantities({})} />
      </div>

      {/* 品揃え更新モーダル */}
      {showRefreshModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            {money < currentRefreshCost ? (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#ff4d4f", lineHeight: "1.6" })}>
                  所持金が不足しています<br />
                  <span className={css({ fontSize: "18px", color: "#e8d8b8" })}>{refreshCount}回目の入れ替えには {currentRefreshCost}G 必要です</span>
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "rgba(200,168,75,0.12)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.35)", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", _hover: { bg: "rgba(200,168,75,0.22)" } })}>戻る</button>
                </div>
              </>
            ) : (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#e8d8b8", lineHeight: "1.6" })}>
                  {refreshCount}回目、{currentRefreshCost}G減りますが<br />素材アイテムを入れ替えますか？
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "rgba(200,168,75,0.12)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.35)", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", _hover: { bg: "rgba(200,168,75,0.22)" } })}>戻る</button>
                  <button onClick={onRefresh} className={css({ bg: "#8b6914", color: "#1a0e06", border: "1px solid #c8a84b", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", _hover: { filter: "brightness(1.15)" } })}>入れ替える {currentRefreshCost}G</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 購入確認リストモーダル */}
      {showBuyModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "24px", fontWeight: "900", mb: "20px", color: "#e8d8b8", letterSpacing: "0.05em" })}>. 購入確認リスト .</p>
            
            <div className={css({ maxHeight: "260px", overflowY: "auto", mb: "20px", px: "4px", display: "flex", flexDirection: "column", gap: "12px" })}>
              
              {/* 【Base 素材の欄】 */}
              {selectedBaseItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#ff7875", bg: "rgba(255,77,79,0.1)", border: "1px solid rgba(255,77,79,0.25)", px: "8px", py: "2px", borderRadius: "4px" })}>【 Base 素材 】</span>
                  <div className={css({ mt: "6px", bg: "rgba(255,255,255,0.04)", borderRadius: "8px", p: "8px" })}>
                    {selectedBaseItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#f8f5ef" })}>{item.name}</span>
                        <span className={css({ fontWeight: "bold", color: "#c8a84b" })}>{`${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 【Accent 素材の欄】 */}
              {selectedAccentItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#73d13d", bg: "rgba(82,196,26,0.1)", border: "1px solid rgba(82,196,26,0.25)", px: "8px", py: "2px", borderRadius: "4px" })}>【 Accent 素材 】</span>
                  <div className={css({ mt: "6px", bg: "rgba(255,255,255,0.04)", borderRadius: "8px", p: "8px" })}>
                    {selectedAccentItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#f8f5ef" })}>{item.name}</span>
                        <span className={css({ fontWeight: "bold", color: "#c8a84b" })}>{`${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* お会計・所持金エリア */}
            <div className={css({ borderTop: "1px dashed rgba(200,168,75,0.35)", pt: "16px", mb: "24px", textAlign: "left", px: "8px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" })}>
                <span className={css({ fontWeight: "bold", color: "#e8d8b8", fontSize: "14px" })}>合計金額</span>
                <span className={css({ fontWeight: "900", color: "#c8a84b", fontSize: "22px" })}>{`${totalCost} G`}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ color: "rgba(232,216,184,0.75)", fontSize: "14px", fontWeight: "bold" })}>現在の お財布 (所持金)</span>
                <span className={css({ fontWeight: "900", color: "#f8f5ef", fontSize: "16px" })}>{`${money} G`}</span>
              </div>
            </div>

            <p className={css({ fontSize: "14px", fontWeight: "bold", color: "#e8d8b8", mb: "24px" })}>以上の素材を購入しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowBuyModal(false)} className={css({ bg: "rgba(200,168,75,0.12)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.35)", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onPurchase} className={css({ bg: "#8b6914", color: "#1a0e06", border: "1px solid #c8a84b", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", _hover: { filter: "brightness(1.15)" } })}>購入する</button>
            </div>
          </div>
        </div>
      )}

      {/* 退店確認モーダル */}
      {showExitModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#e8d8b8" })}>ショップを退店しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowExitModal(false)} className={css({ bg: "rgba(200,168,75,0.12)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.35)", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onExit} className={css({ bg: "#8b6914", color: "#1a0e06", border: "1px solid #c8a84b", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", _hover: { filter: "brightness(1.15)" } })}>退店する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
