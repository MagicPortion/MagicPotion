import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, shuffleArray, type MaterialDef } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import ShopMessage from "../ui/shop/ShopMessage";
import ShopItemGrid from "../ui/shop/ShopItemGrid";
import InventoryPanel from "../ui/shop/InventoryPanel";

export default function ShopScene() {
  const { materials, buyMaterial, advanceScene } = useGameStore();
  const [message, setMessage] = useState("いらっしゃいませ！材料をお選びください。");
  const [shopItems] = useState<MaterialDef[]>(() => shuffleArray(MATERIALS).slice(0, 6));
  const { width, height } = useWindowSize();

  const handleBuy = (item: MaterialDef) => {
    const success = buyMaterial(item.id, item.price);
    setMessage(success ? `${item.name}を購入しました！` : "お金が足りません…");
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfff9c4 },
    { type: "rect", x: width - 130, y: height * 0.3, width: 100, height: 160, color: 0xd8b4fe },
    { type: "text", x: width - 114, y: height * 0.3 + 72, text: "店主", fontSize: 14, textColor: "#888" },
  ], [width, height]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0xfff9c4} />
      <ShopMessage message={message} />
      <ShopItemGrid items={shopItems} onBuy={handleBuy} />
      <InventoryPanel materials={materials} />
      <DialogueBox
        actions={<ActionButton onClick={advanceScene}>買い物を終える →</ActionButton>}
      />
    </div>
  );
}
