import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDef } from '../../../data/types';
import { css } from "#styled-system/css";
import ArrowBanner from '../common/ArrowBanner';
import ModalOverlay from '../common/ModalOverlay';

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

  const modalContentStyle = css({
    bg: "white",
    borderRadius: "24px",
    p: "32px",
    w: "520px",
    textAlign: "center",
    boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
    border: "4px solid #e2a581"
  });

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px" })}>
      <div className={css({ mb: "20px" })}>
        <ArrowBanner>素材 ショップ</ArrowBanner>
      </div>
      <div className={css({ position: "relative", bg: "#f3be9f", border: "6px solid #e2a581", borderRadius: "24px", w: "95%", maxW: "1020px", h: "650px", p: "45px 35px 30px 35px", boxShadow: "0 22px 45px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" })}>
        <button 
          onClick={handleRefreshTap}
          disabled={hasSelectedItems}
          className={css({ position: "absolute", top: "28px", left: "28px", background: "none", border: "none", color: "#46a1ea", zIndex: 5, transition: "transform 0.2s, opacity 0.2s", cursor: "pointer", _hover: { transform: "rotate(45deg)", opacity: 0.8 } })}
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
        <ModalOverlay backdrop="rgba(0, 0, 0, 0.6)" zIndex={100}>
          <div className={modalContentStyle}>
            {money < currentRefreshCost ? (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#ff4d4f", lineHeight: "1.6" })}>
                  所持金が不足しています<br />
                  <span className={css({ fontSize: "18px", color: "#4a3321" })}>{refreshCount}回目の入れ替えには {currentRefreshCost}G 必要です</span>
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "#bae7ff", color: "#0050b3", border: "none", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
                </div>
              </>
            ) : (
              <>
                <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#4a3321", lineHeight: "1.6" })}>
                  {refreshCount}回目、{currentRefreshCost}G減りますが<br />素材アイテムを入れ替えますか？
                </p>
                <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
                  <button onClick={() => setShowRefreshModal(false)} className={css({ bg: "#bae7ff", color: "#0050b3", border: "none", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
                  <button onClick={onRefresh} className={css({ bg: "#ff7875", color: "white", border: "none", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>入れ替える -{currentRefreshCost}G</button>
                </div>
              </>
            )}
          </div>
        </ModalOverlay>
      )}

      {/* 購入確認リストモーダル */}
      {showBuyModal && (
        <ModalOverlay backdrop="rgba(0, 0, 0, 0.6)" zIndex={100}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "24px", fontWeight: "900", mb: "20px", color: "#4a3321", letterSpacing: "0.05em" })}>. 購入確認リスト .</p>
            
            <div className={css({ maxHeight: "260px", overflowY: "auto", mb: "20px", px: "4px", display: "flex", flexDirection: "column", gap: "12px" })}>
              
              {/* 【Base 素材の欄】 */}
              {selectedBaseItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#ff4d4f", bg: "#fff1f0", px: "8px", py: "2px", borderRadius: "4px" })}>【 Base 素材 】</span>
                  <div className={css({ mt: "6px", bg: "#fafafa", borderRadius: "8px", p: "8px" })}>
                    {selectedBaseItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#222" })}>{item.name}</span>
                        {/* 【修正】テンプレートリテラルで安全に文字列結合しました */}
                        <span className={css({ fontWeight: "bold", color: "#4a3321" })}>{`-${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 【Accent 素材の欄】 */}
              {selectedAccentItems.length > 0 && (
                <div className={css({ textAlign: "left" })}>
                  <span className={css({ fontSize: "12px", fontWeight: "bold", color: "#52c41a", bg: "#f6ffed", px: "8px", py: "2px", borderRadius: "4px" })}>【 Accent 素材 】</span>
                  <div className={css({ mt: "6px", bg: "#fafafa", borderRadius: "8px", p: "8px" })}>
                    {selectedAccentItems.map(item => (
                      <div key={item.instanceId} className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", py: "4px" })}>
                        <span className={css({ fontSize: "15px", fontWeight: "bold", color: "#222" })}>{item.name}</span>
                        {/* 【修正】こちらも同様に修正完了 */}
                        <span className={css({ fontWeight: "bold", color: "#4a3321" })}>{`-${item.price} G`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* お会計・所持金エリア */}
            <div className={css({ borderTop: "2px dashed #e8e8e8", pt: "16px", mb: "24px", textAlign: "left", px: "8px" })}>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" })}>
                <span className={css({ fontWeight: "bold", color: "#555", fontSize: "14px" })}>合計金額</span>
                <span className={css({ fontWeight: "900", color: "#ff4d4f", fontSize: "22px" })}>{`-${totalCost} G`}</span>
              </div>
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <span className={css({ color: "#777", fontSize: "14px", fontWeight: "bold" })}>現在の お財布 (所持金)</span>
                <span className={css({ fontWeight: "900", color: "#4a3321", fontSize: "16px" })}>{`${money} G`}</span>
              </div>
            </div>

            <p className={css({ fontSize: "14px", fontWeight: "bold", color: "#555", mb: "24px" })}>以上の素材を購入しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowBuyModal(false)} className={css({ bg: "#bae7ff", color: "#0050b3", border: "none", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onPurchase} className={css({ bg: "#52c41a", color: "white", border: "none", px: "36px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>購入する</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 退店確認モーダル */}
      {showExitModal && (
        <ModalOverlay backdrop="rgba(0, 0, 0, 0.6)" zIndex={100}>
          <div className={modalContentStyle}>
            <p className={css({ fontSize: "20px", fontWeight: "bold", mb: "24px", color: "#4a3321" })}>ショップを退店しますか？</p>
            <div className={css({ display: "flex", justifyContent: "center", gap: "16px" })}>
              <button onClick={() => setShowExitModal(false)} className={css({ bg: "#bae7ff", color: "#0050b3", border: "none", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>戻る</button>
              <button onClick={onExit} className={css({ bg: "#ff4d4f", color: "white", border: "none", px: "32px", py: "12px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" })}>退店する</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}