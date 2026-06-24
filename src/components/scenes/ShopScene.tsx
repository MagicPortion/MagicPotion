import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, SHOP_SLOTS_BY_LEVEL, sampleWeightedChoices } from "../../data/gameData";
import DialogueBox from "../ui/dialogue/DialogueBox";
import ShopUI from "../ui/shop/ShopUI";

export default function ShopScene() {
  const { money, shopLevel, buyMaterial, advanceScene, setIsInventoryOpen } = useGameStore();
  const shopSlots = Math.max(5, SHOP_SLOTS_BY_LEVEL[shopLevel] ?? 5);

  // ランダムに5枚の素材を被らない一意のIDで生成
  const [shopItems, setShopItems] = useState(() => {
    return sampleWeightedChoices(MATERIALS, shopSlots).map((item, i) => ({
      ...item,
      instanceId: `shop-item-${i}-${item.id}`,
    }));
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [soldOutItems, setSoldOutItems] = useState<Record<string, boolean>>({});
  const [refreshCount, setRefreshCount] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const { width, height } = useWindowSize();

  const selectedItems = shopItems.filter((item) => (quantities[item.instanceId] ?? 0) === 1);
  const totalCost = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems]);
  const canBuy = selectedItems.length > 0 && totalCost <= money;

  const currentRefreshCost = useMemo(() => {
    return 10 * Math.pow(2, refreshCount - 1);
  }, [refreshCount]);

  const handleCardClick = (instanceId: string) => {
    if (soldOutItems[instanceId]) return;
    setQuantities((prev) => ({
      ...prev,
      [instanceId]: (prev[instanceId] ?? 0) === 1 ? 0 : 1,
    }));
  };

  const handleRefreshTap = () => {
    if (selectedItems.length === 0 && money >= currentRefreshCost) {
      setShowRefreshModal(true);
    }
  };

  const handleExecuteRefresh = () => {
    if (money < currentRefreshCost) return;

    buyMaterial("refresh_fee", currentRefreshCost);

    const newItems = sampleWeightedChoices(MATERIALS, shopSlots).map((item, i) => ({
      ...item,
      instanceId: `${item.id}-${Date.now()}-${i}`,
    }));
    setShopItems(newItems);
    setQuantities({});
    setSoldOutItems({});
    setRefreshCount((prev) => prev + 1);
    setShowRefreshModal(false);
  };

  const commands = useMemo<DrawCommand[]>(
    () => [{ type: "rect", x: 0, y: 0, width, height, color: 0x2c2c2c }],
    [width, height],
  );

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
        showBuyModal={showBuyModal}
        showExitModal={showExitModal}
        showRefreshModal={showRefreshModal}
        setShowRefreshModal={setShowRefreshModal}
        onPurchase={handleExecutePurchase}
        onRefresh={handleExecuteRefresh}
        onExit={advanceScene}
      />
      <DialogueBox onInventory={() => setIsInventoryOpen(true)} />
    </div>
  );
}
