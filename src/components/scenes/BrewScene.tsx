import { useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, getPotion, colorNum } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";

export default function BrewScene() {
  const { materials, brew, advanceScene } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [message, setMessage] = useState("材料を選んで調合しよう！");
  const [cauldronColorHex, setCauldronColorHex] = useState("5f9ea0");
  const { width, height } = useWindowSize();

  const ownedBases   = MATERIALS.filter((m) => m.category === "base"   && (materials[m.id] ?? 0) > 0);
  const ownedAccents = MATERIALS.filter((m) => m.category === "accent" && (materials[m.id] ?? 0) > 0);

  const handleBrew = () => {
    if (!selectedBase || !selectedAccent) { setMessage("材料を2つ選んでください！"); return; }
    const brewed = brew(selectedBase, selectedAccent);
    if (brewed) {
      const potionDef = getPotion(brewed.potionId);
      setCauldronColorHex(potionDef?.colorHex ?? "808080");
      setMessage(`✨ ${potionDef?.name ?? "謎の薬"}（Lv.${brewed.level} / ${brewed.sellPrice}G）が完成！`);
      setSelectedBase(null);
      setSelectedAccent(null);
    } else {
      setMessage("調合できません…材料が足りないか、組み合わせが違うみたい。");
    }
  };

  const handleSelectRecipe = (baseId: string, accentId: string) => {
    setSelectedBase(baseId);
    setSelectedAccent(accentId);
    setMessage("材料をセットしました！「調合する！」を押してください。");
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0x1a1a2e },
    { type: "rect", x: width / 2 - 60, y: height * 0.4, width: 120, height: 100, color: colorNum(cauldronColorHex) },
    { type: "text", x: width / 2 - 22, y: height * 0.4 + 42, text: "大釜", fontSize: 14, textColor: "#fff" },
    { type: "rect", x: width / 2 - 220, y: height * 0.35, width: 80, height: 130, color: 0xffb6c1 },
    { type: "text", x: width / 2 - 210, y: height * 0.35 + 60, text: "魔女", fontSize: 14, textColor: "#888" },
  ], [width, height, cauldronColorHex]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x0d0d1a} />

      {/* メッセージ */}
      <div
        style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
        className={css({ bg: "pastel.lavender", px: "20px", py: "8px", borderRadius: "20px", boxShadow: "0 3px 12px rgba(0,0,0,0.25)", fontSize: "15px", color: "#4a3f55", whiteSpace: "nowrap" })}
      >
        {message}
      </div>

      {/* ベース材料 */}
      <div
        style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 180 }}
        className={css({ bg: "pastel.peach", borderRadius: "14px", p: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" })}
      >
        <p style={{ fontSize: 13, color: "#6b5b73", margin: "0 0 8px", fontWeight: "bold" }}>ベース材料</p>
        {ownedBases.length === 0
          ? <p style={{ fontSize: 12, color: "#aaa" }}>なし</p>
          : ownedBases.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedBase(m.id)}
              className={css({
                display: "block", width: "100%", mb: "4px", p: "7px 10px",
                borderRadius: "8px", border: "2px solid",
                borderColor: selectedBase === m.id ? "pastel.pink" : "transparent",
                bg: selectedBase === m.id ? "pastel.rose" : "white",
                cursor: "pointer", fontSize: "12px", color: "#4a3f55",
                _hover: { bg: "pastel.lemon" },
              })}
            >
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: `#${m.colorHex}`, marginRight: 6, verticalAlign: "middle" }} />
              {m.name} ×{materials[m.id]}
            </button>
          ))}
      </div>

      {/* アクセント材料 */}
      <div
        style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 180 }}
        className={css({ bg: "pastel.sky", borderRadius: "14px", p: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" })}
      >
        <p style={{ fontSize: 13, color: "#6b5b73", margin: "0 0 8px", fontWeight: "bold" }}>アクセント材料</p>
        {ownedAccents.length === 0
          ? <p style={{ fontSize: 12, color: "#aaa" }}>なし</p>
          : ownedAccents.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedAccent(m.id)}
              className={css({
                display: "block", width: "100%", mb: "4px", p: "7px 10px",
                borderRadius: "8px", border: "2px solid",
                borderColor: selectedAccent === m.id ? "pastel.lilac" : "transparent",
                bg: selectedAccent === m.id ? "pastel.lavender" : "white",
                cursor: "pointer", fontSize: "12px", color: "#4a3f55",
                _hover: { bg: "pastel.lemon" },
              })}
            >
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: `#${m.colorHex}`, marginRight: 6, verticalAlign: "middle" }} />
              {m.name} ×{materials[m.id]}
            </button>
          ))}
      </div>

      <DialogueBox
        onRecipeSelect={handleSelectRecipe}
        actions={
          <>
            <ActionButton
              onClick={handleBrew}
              disabled={!selectedBase || !selectedAccent}
            >
              調合する！
            </ActionButton>
            <ActionButton variant="secondary" onClick={advanceScene}>
              陳列へ →
            </ActionButton>
          </>
        }
      />
    </div>
  );
}
