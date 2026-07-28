import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, SHOP_SLOTS_BY_LEVEL, sampleWeightedChoices } from "../../data/gameData";
import DialogueBox from "../ui/dialogue/DialogueBox";
import ShopUI from "../ui/shop/ShopUI";
import shopBackground from "#assets/Back/ShopBack.png";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  category: "base" | "accent";
}

export default function ShopScene() {
  const {
    money,
    day,
    shopLevel,
    buyMaterial,
    advanceScene,
    setIsInventoryOpen,
    setPendingPostPurchaseScene,
  } = useGameStore();
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
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [refreshCount, setRefreshCount] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const { width, height } = useWindowSize();

  const selectedItems = shopItems.filter((item) => (quantities[item.instanceId] ?? 0) === 1);
  const totalCost = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems]);
  const canBuy = selectedItems.length > 0 && totalCost <= money;

  const REFRESH_COSTS = [10, 20, 40, 70, 100, 140, 180, 220, 260, 300];

  const currentRefreshCost = useMemo(() => {
    const index = Math.min(refreshCount - 1, REFRESH_COSTS.length - 1);
    return REFRESH_COSTS[index];
  }, [refreshCount]);

  const handleCardClick = (instanceId: string) => {
    if (soldOutItems[instanceId]) return;
    setQuantities((prev) => ({
      ...prev,
      [instanceId]: (prev[instanceId] ?? 0) === 1 ? 0 : 1,
    }));
  };

  const handleRefreshTap = () => {
    if (selectedItems.length === 0) {
      setShowRefreshModal(true);
    }
  };

  const handleExecuteRefresh = () => {
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
    () => [{ type: "image", x: 0, y: 0, width, height, imageSrc: shopBackground }],
    [width, height],
  );

  const handleExecutePurchase = () => {
    if (selectedItems.length === 0 || !canBuy) return;

    const newSoldOut = { ...soldOutItems };
    const purchasedReceiptItems: ReceiptItem[] = [];
    for (const item of selectedItems) {
      buyMaterial(item.id, item.price);
      newSoldOut[item.instanceId] = true;
      purchasedReceiptItems.push({
        id: item.instanceId,
        name: item.name,
        price: item.price,
        category: item.category,
      });
    }

    setReceiptItems((prev) => [...prev, ...purchasedReceiptItems]);
    setSoldOutItems(newSoldOut);
    setQuantities({});
    setShowBuyModal(false);
    setPendingPostPurchaseScene("conversation_brew");
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} />
      <ShopUI
        money={money}
        day={day}
        shopItems={shopItems}
        quantities={quantities}
        soldOutItems={soldOutItems}
        totalCost={totalCost}
        canBuy={canBuy}
        currentRefreshCost={currentRefreshCost}
        refreshCount={refreshCount}
        handleCardClick={handleCardClick}
        handleRefreshTap={handleRefreshTap}
        setShowBuyModal={setShowBuyModal}
        setShowExitModal={setShowExitModal}
        setQuantities={setQuantities}
        showBuyModal={showBuyModal}
        showExitModal={showExitModal}
        showRefreshModal={showRefreshModal}
        setShowRefreshModal={setShowRefreshModal}
        receiptItems={receiptItems}
        onPurchase={handleExecutePurchase}
        onRefresh={handleExecuteRefresh}
        onExit={advanceScene}
      />
      <DialogueBox onInventory={() => setIsInventoryOpen(true)} />
    </div>
  );
}
