// src/components/scenes/ShopScene.tsx
import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, SHOP_SLOTS_BY_LEVEL } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import ShopUI from "../ui/shop/ShopUI";

export default function ShopScene() {
  const { money, shopLevel, buyMaterial, advanceScene } = useGameStore();
  const shopSlots = Math.max(5, SHOP_SLOTS_BY_LEVEL[shopLevel] ?? 5);
  
  // 📦 materials.json のデータから重複ありで5つの商品を自動抽選
  const [shopItems, setShopItems] = useState(() => {
    const items = [];
    for (let i = 0; i < shopSlots; i++) {
      const randomIndex = Math.floor(Math.random() * MATERIALS.length);
      items.push({ ...MATERIALS[randomIndex], instanceId: `${MATERIALS[randomIndex].id}-${i}` });
    }
    return items;
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [soldOutItems, setSoldOutItems] = useState<Record<string, boolean>>({});
  
  const [refreshCount, setRefreshCount] = useState(1);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); 

  const { width, height } = useWindowSize();

  const selectedItems = shopItems.filter((item) => (quantities[item.instanceId] ?? 0) > 0);
  const totalCost = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const canBuy = selectedItems.length > 0 && totalCost <= money;

  const currentRefreshCost = useMemo(() => {
    return 10 * Math.pow(2, refreshCount - 1);
  }, [refreshCount]);

  const handleCardClick = (instanceId: string) => {
    if (soldOutItems[instanceId]) return;

    const isSelected = (quantities[instanceId] ?? 0) > 0;
    if (isSelected) {
      const newQuantities = { ...quantities };
      delete newQuantities[instanceId];
      setQuantities(newQuantities);
    } else {
      const item = shopItems.find((m) => m.instanceId === instanceId);
      if (!item) return;
      if (totalCost + item.price <= money) {
        setQuantities({ ...quantities, [instanceId]: 1 });
      }
    }
  };

  const handleRefreshTap = () => {
    if (selectedItems.length === 0 && money >= currentRefreshCost) {
      setShowRefreshModal(true);
    }
  };

  const handleExecuteRefresh = () => {
    if (money < currentRefreshCost) return;

    buyMaterial("refresh_fee", currentRefreshCost);

    const newItems = [];
    for (let i = 0; i < shopSlots; i++) {
      const randomIndex = Math.floor(Math.random() * MATERIALS.length);
      newItems.push({ ...MATERIALS[randomIndex], instanceId: `${MATERIALS[randomIndex].id}-${Date.now()}-${i}` });
    }

    setShopItems(newItems);
    setQuantities({});
    setSoldOutItems({}); 
    setRefreshCount(prev => prev + 1);
    setShowRefreshModal(false);
  };

  const handleExecutePurchase = () => {
    if (selectedItems.length === 0 || !canBuy) return;

    const newSoldOut = { ...soldOutItems };
    for (const item of selectedItems) {
      buyMaterial(item.id, item.price);
      newSoldOut[item.instanceId] = true; 
    }

    setSoldOutItems(newSoldOut);
    setQuantities({}); 
    setShowBuyModal(false);
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0x2c2c2c }, 
  ], [width, height]);

  const baseSelectedItems = selectedItems.filter(item => item.category === "base");
  const accentSelectedItems = selectedItems.filter(item => item.category === "accent");

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x2c2c2c} />

      <ShopUI 
        money={money}
        shopItems={shopItems}
        quantities={quantities}
        soldOutItems={soldOutItems}
        totalCost={totalCost}
        canBuy={canBuy}
        currentRefreshCost={currentRefreshCost}
        handleCardClick={handleCardClick}
        handleRefreshTap={handleRefreshTap}
        setShowBuyModal={setShowBuyModal}
        setShowExitModal={setShowExitModal}
        setQuantities={setQuantities}
      />

      {/* 🔄 リロード確認モーダル（インラインstyleに変更） */}
      {showRefreshModal && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "18px", width: "440px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "32px", color: "#333", lineHeight: "1.7" }}>
              {refreshCount}回目、{currentRefreshCost}G減りますが<br />素材アイテムを入れ替えますか？
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <button onClick={() => setShowRefreshModal(false)} style={{ backgroundColor: "#bae7ff", color: "#0050b3", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>戻る</button>
              <button onClick={handleExecuteRefresh} style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
                入れ替える<br />
                <span style={{ fontSize: "12px", fontWeight: "normal" }}>-{currentRefreshCost}G</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛒 購入確認モーダル （インラインstyleに変更＆paddingVerticalを完全消去） */}
      {showBuyModal && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "18px", width: "520px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ textAlign: "center", fontWeight: "bold", color: "#333", marginBottom: "20px", fontSize: "22px", letterSpacing: "0.1em" }}>. 購入確認リスト .</div>
            <div style={{ maxHeight: "240px", overflowY: "auto", marginBottom: "20px", borderBottom: "2px dashed #eee", paddingBottom: "15px", paddingLeft: "5px", paddingRight: "5px" }}>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#ff4d4f", backgroundColor: "#fff1f0", padding: "4px 10px", borderRadius: "4px", marginBottom: "8px" }}>【 Base 素材 】</div>
                {baseSelectedItems.length === 0 ? (
                  <div style={{ fontSize: "14px", color: "#aaa", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px" }}>選択なし</div>
                ) : (
                  baseSelectedItems.map((item) => (
                    <div key={item.instanceId} style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "10px", color: "#444" }}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight: "bold" }}>-{item.price} G</span>
                    </div>
                  ))
                )}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#52c41a", backgroundColor: "#f6ffed", padding: "4px 10px", borderRadius: "4px", marginBottom: "8px" }}>【 Accent 素材 】</div>
                {accentSelectedItems.length === 0 ? (
                  <div style={{ fontSize: "14px", color: "#aaa", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px" }}>選択なし</div>
                ) : (
                  accentSelectedItems.map((item) => (
                    <div key={item.instanceId} style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "10px", color: "#444" }}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight: "bold" }}>-{item.price} G</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>合計金額</span>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#ff4d4f" }}>-{totalCost} G</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", paddingTop: "8px", marginTop: "8px" }}>
                <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>現在のお財布（所持金）</span>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#111" }}>{money} G</span>
              </div>
            </div>
            <div style={{ fontSize: "15px", textAlign: "center", marginBottom: "24px", color: "#222", fontWeight: "bold" }}>以上の素材を購入しますか？</div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <button onClick={() => setShowBuyModal(false)} style={{ backgroundColor: "#bae7ff", color: "#0050b3", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>戻る</button>
              <button onClick={handleExecutePurchase} style={{ backgroundColor: "#52c41a", color: "white", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>購入する</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚪 退店確認モーダル（インラインstyleに変更） */}
      {showExitModal && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "18px", width: "440px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "32px", color: "#333", letterSpacing: "0.05em" }}>
              素材ショップから<br />退店しますか？
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <button onClick={() => setShowExitModal(false)} style={{ backgroundColor: "#bae7ff", color: "#0050b3", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>お店に残る</button>
              <button onClick={advanceScene} style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "14px 24px", borderRadius: "28px", flex: 1, cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>退店する</button>
            </div>
          </div>
        </div>
      )}

      <DialogueBox />
    </div>
  );
}