import { IconRefresh } from '../icons';
import ShopCard from './ShopCard';
import ShopActionBar from './ShopActionBar';
import type { MaterialDef } from '../../../data/types';
import { css } from '../../../../styled-system/css';

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
  handleCardClick: (instanceId: string) => void;
  handleRefreshTap: () => void;
  setShowBuyModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  setQuantities: (quantities: Record<string, number>) => void;
}

export default function ShopUI({
  money, shopItems, quantities, soldOutItems, totalCost, canBuy, currentRefreshCost,
  handleCardClick, handleRefreshTap, setShowBuyModal, setShowExitModal, setQuantities
}: ShopUIProps) {
  const firstRowItems = shopItems.slice(0, 3);
  const secondRowItems = shopItems.slice(3, 5);
  const hasSelectedItems = shopItems.some((item) => (quantities[item.instanceId] ?? 0) > 0);

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, pb: "35px" })}>
      <div className={css({ position: "relative", bg: "#46a1ea", color: "white", fontSize: "42px", fontWeight: "bold", pl: "160px", pr: "160px", pt: "14px", pb: "14px", borderRadius: "10px", mb: "20px", letterSpacing: "0.2em", boxShadow: "0 6px 16px rgba(0,0,0,0.25)" })}>
        <span style={{ position: "absolute", left: "40px", color: "white" }}>◀</span>
        素材 ショップ
        <span style={{ position: "absolute", right: "40px", color: "white" }}>▶</span>
      </div>
      <div className={css({ position: "relative", bg: "#f3be9f", border: "6px solid #e2a581", borderRadius: "24px", w: "95%", maxW: "1020px", h: "650px", p: "45px 35px 30px 35px", boxShadow: "0 22px 45px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" })}>
        <button 
          onClick={handleRefreshTap}
          disabled={(money < currentRefreshCost) || hasSelectedItems}
          className={css({ position: "absolute", top: "28px", left: "28px", background: "none", border: "none", color: "#46a1ea", zIndex: 5, transition: "transform 0.2s, opacity 0.2s", cursor: "pointer", _hover: { transform: "rotate(45deg)", opacity: 0.8 } })}
          style={{ opacity: hasSelectedItems ? 0.25 : 1, cursor: hasSelectedItems ? "not-allowed" : "pointer" }}
        >
          <IconRefresh size={52} />
        </button>
        <div className={css({ display: "flex", flexDirection: "column", gap: "28px", alignItems: "center", justifyContent: "center", flex: 1 })}>
          <div className={css({ display: "flex", justifyContent: "center", gap: "32px", w: "100%" })}>
            {firstRowItems.map((item) => <ShopCard key={item.instanceId} item={item} isSelected={!!quantities[item.instanceId]} isSoldOut={!!soldOutItems[item.instanceId]} onClick={() => handleCardClick(item.instanceId)} />)}
          </div>
          <div className={css({ display: "flex", justifyContent: "center", gap: "32px", w: "100%" })}>
            {secondRowItems.map((item) => <ShopCard key={item.instanceId} item={item} isSelected={!!quantities[item.instanceId]} isSoldOut={!!soldOutItems[item.instanceId]} onClick={() => handleCardClick(item.instanceId)} />)}
          </div>
        </div>
        <ShopActionBar totalCost={totalCost} canBuy={canBuy} hasSelectedItems={hasSelectedItems} setShowBuyModal={setShowBuyModal} setShowExitModal={setShowExitModal} onClear={() => setQuantities({})} />
      </div>
    </div>
  );
}