import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDefWithUrl } from '../../../data/types';
import { css } from "#styled-system/css";

interface ShopMaterialItem extends MaterialDefWithUrl {
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
    bg: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100
  });

  const modalContentStyle = css({
    bg: "rgba(12,8,3,0.98)",
    borderRadius: "12px",
    p: "32px",
    w: "520px",
    textAlign: "center",
    boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
    border: "4px solid #8B6914"
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px" })}>
      <div className={css({ position: "relative", bg: "rgba(30,20,8,0.96)", color: "#c8a84b", border: "2px solid #8B6914", fontSize: "42px", fontWeight: "bold", pl: "160px", pr: "160px", pt: "14px", pb: "14px", borderRadius: "10px", mb: "20px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}>
        素材ショップ
      </div>
      <div className={css({ position: "relative", bg: "rgba(12,8,3,0.96)", border: "6px solid #8B6914", borderRadius: "12px", w: "95%", maxW: "1020px", h: "650px", p: "45px 35px 30px 35px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)", display: "flex", flexDirection: "column", justifyContent: "space-between" })}>
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

      {/* 購入確認リストモーダル */}
      {showBuyModal && (
        <div className={modalOverlayStyle}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "24px", fontWeight: "900", mb: "20px", color: "#c8a84b", letterSpacing: "0.05em" })}>. 購入確認リスト .</p>
            
            <div className={css({ maxHeight: "260px", overflowY: "auto", mb: "20px", px: "4px", display: "flex", flexDirection: "column", gap: "12px" })}>
              
              {/* 【Base 素材の欄】 */}
              {selectedBaseItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#d87872", bg: "#1a0e06", border: "1px solid #a6534f", px: "8px", py: "2px", borderRadius: "4px" })}>【 Base 素材 】</span>
                  <div className={css({ mt: "6px", bg: "rgba(30,20,8,0.78)", border: "1px solid #4a3810", borderRadius: "8px", p: "8px" })}>
                    {selectedBaseItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#e8d8b8" })}>{item.name}</span>
                        <span className={css({ fontWeight: "bold", color: "#c8a84b" })}>{`${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 【Accent 素材の欄】 */}
              {selectedAccentItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#a7cb70", bg: "#1a0e06", border: "1px solid #789b4a", px: "8px", py: "2px", borderRadius: "4px" })}>【 Accent 素材 】</span>
                  <div className={css({ mt: "6px", bg: "rgba(30,20,8,0.78)", border: "1px solid #4a3810", borderRadius: "8px", p: "8px" })}>
                    {selectedAccentItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#e8d8b8" })}>{item.name}</span>
                        <span className={css({ fontWeight: "bold", color: "#c8a84b" })}>{`${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* お会計・所持金エリア */}
            <div className={css({ borderTop: "2px dashed #4a3810", pt: "16px", mb: "24px", textAlign: "left", px: "8px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" })}>
                <span className={css({ fontWeight: "bold", color: "#e8d8b8", fontSize: "14px" })}>合計金額</span>
                <span className={css({ fontWeight: "900", color: "#d87872", fontSize: "22px" })}>{`${totalCost} G`}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ color: "#e8d8b8", fontSize: "14px", fontWeight: "bold" })}>現在の 所持金</span>
                <span className={css({ fontWeight: "900", color: "#c8a84b", fontSize: "16px" })}>{`${money} G`}</span>
              </div>
            </div>

            <p className={css({ fontSize: "14px", fontWeight: "bold", color: "#e8d8b8", mb: "24px" })}>以上の素材を購入しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowBuyModal(false)} className={css({ bg: "#1a0e06", color: "#c8a84b", border: "1px solid #8B6914", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onPurchase} className={css({ bg: "#c8a84b", color: "#1a0e06", border: "1px solid #e0c56f", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>購入する</button>
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
              <button onClick={() => setShowExitModal(false)} className={css({ bg: "#1a0e06", color: "#c8a84b", border: "1px solid #8B6914", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onExit} className={css({ bg: "#a6534f", color: "#fff4e0", border: "1px solid #d87872", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>退店する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
