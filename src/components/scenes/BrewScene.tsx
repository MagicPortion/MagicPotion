import { useMemo, useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, getPotion, colorNum, RECIPES, calcSellPrice } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import BrewPanel, { type BrewResult } from "../ui/brew/BrewPanel";
import MaterialPickerPopup from "../ui/brew/MaterialPickerPopup";
import BrewResultPopup from "../ui/brew/BrewResultPopup";
import PotionShelf from "../ui/brew/PotionShelf";
import { css } from "../../../styled-system/css";

export default function BrewScene() {
  const { materials, brew, advanceScene, recipeLevel } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<"base" | "accent" | null>(null);
  const [cauldronColorHex, setCauldronColorHex] = useState("3d3d5c");
  const [brewCount, setBrewCount] = useState(1);
  const [brewResults, setBrewResults] = useState<BrewResult[] | null>(null);
  const { width, height } = useWindowSize();

  // ── 調合アニメーション演出用の状態 ──
  const [isBrewing, setIsBrewing] = useState(false);
  const [pendingResults, setPendingResults] = useState<{ results: BrewResult[]; targetColorHex: string } | null>(null);
  const [bubbles, setBubbles] = useState<{ x: number; y: number; radius: number; color: number }[]>([]);

  const allBases   = MATERIALS.filter((m) => m.category === "base");
  const allAccents = MATERIALS.filter((m) => m.category === "accent");

  const suggestedItems = useMemo(() => {
    if (pickerOpen === "accent" && selectedBase) {
      return RECIPES
        .filter((r) => (recipeLevel[r.id] ?? 0) > 0)
        .filter((r) => r.baseId === selectedBase)
        .map((r) => MATERIALS.find((m) => m.id === r.accentId))
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .filter((m) => (materials[m.id] ?? 0) > 0);
    }

    if (pickerOpen === "base" && selectedAccent) {
      return RECIPES
        .filter((r) => (recipeLevel[r.id] ?? 0) > 0)
        .filter((r) => r.accentId === selectedAccent)
        .map((r) => MATERIALS.find((m) => m.id === r.baseId))
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .filter((m) => (materials[m.id] ?? 0) > 0);
    }

    return [];
  }, [pickerOpen, selectedBase, selectedAccent, recipeLevel, materials]);

  const suggestedRecipes = useMemo(() => {
    if (pickerOpen === "accent" && selectedBase) {
      return RECIPES
        .filter((r) => (recipeLevel[r.id] ?? 0) > 0)
        .filter((r) => r.baseId === selectedBase)
        .map((r) => {
          const material = MATERIALS.find((m) => m.id === r.accentId);
          const potion = getPotion(r.potionId);
          const level = recipeLevel[r.id] ?? 1;

          if (!material || !potion) return null;
          if ((materials[material.id] ?? 0) <= 0) return null;

          const currentLevel = level;
          const nextLevel = level + 1;

          const currentPrice =
            calcSellPrice(potion.basePrice, currentLevel);

          const nextPrice =
            calcSellPrice(potion.basePrice, nextLevel);

          return {
            materialId: material.id,
            potionName: potion.name,

            currentLevel,
            nextLevel,

            currentPrice,
            nextPrice,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));
    }

    if (pickerOpen === "base" && selectedAccent) {
      return RECIPES
        .filter((r) => (recipeLevel[r.id] ?? 0) > 0)
        .filter((r) => r.accentId === selectedAccent)
        .map((r) => {
          const material = MATERIALS.find((m) => m.id === r.baseId);
          const potion = getPotion(r.potionId);
          const level = recipeLevel[r.id] ?? 1;

          if (!material || !potion) return null;
          if ((materials[material.id] ?? 0) <= 0) return null;

          const currentLevel = level;
          const nextLevel = level + 1;

          const currentPrice =
            calcSellPrice(potion.basePrice, currentLevel);

          const nextPrice =
            calcSellPrice(potion.basePrice, nextLevel);

          return {
            materialId: material.id,
            potionName: potion.name,

            currentLevel,
            nextLevel,

            currentPrice,
            nextPrice,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));
    }

    return [];
  }, [pickerOpen, selectedBase, selectedAccent, recipeLevel, materials]);

  const maxBrew = selectedBase && selectedAccent
    ? Math.min(materials[selectedBase] ?? 0, materials[selectedAccent] ?? 0)
    : 0;

  const handleSelectBase = (id: string) => {
    setSelectedBase(id);
    setBrewCount(1);
  };

  const handleSelectAccent = (id: string) => {
    setSelectedAccent(id);
    setBrewCount(1);
  };

  const handleBrew = () => {
    if (!selectedBase || !selectedAccent) return;
    const results: BrewResult[] = [];
    let lastColorHex = "808080";
    for (let i = 0; i < brewCount; i++) {
      const brewed = brew(selectedBase, selectedAccent);
      if (!brewed) break;
      const potionDef = getPotion(brewed.potionId);
      if (potionDef) {
        lastColorHex = potionDef.colorHex;
        results.push({ name: potionDef.name, colorHex: potionDef.colorHex, level: brewed.level, sellPrice: brewed.sellPrice });
      }
    }
    if (results.length > 0) {
      // 演出フェーズの開始。即時結果は表示せず、状態を一時保存して演出をONにする
      setPendingResults({ results, targetColorHex: lastColorHex });
      setIsBrewing(true);
      setSelectedBase(null);
      setSelectedAccent(null);
      setBrewCount(1);
    }
  };

  // スキップ処理
  const handleSkip = () => {
    if (!isBrewing || !pendingResults) return;
    setIsBrewing(false);
    setCauldronColorHex(pendingResults.targetColorHex);
    setBrewResults(pendingResults.results);
    setPendingResults(null);
    setBubbles([]);
  };

  // 演出用タイマーと泡パーティクルアニメーションループ
  useEffect(() => {
    if (!isBrewing || !pendingResults) {
      return;
    }

    // 2秒（2000ms）で自動的に調合ポップアップ表示へ遷移
    const timeout = setTimeout(() => {
      setIsBrewing(false);
      setCauldronColorHex(pendingResults.targetColorHex);
      setBrewResults(pendingResults.results);
      setPendingResults(null);
      setBubbles([]);
    }, 2000);

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      
      setBubbles((prev) => {
        // 既存の泡を上昇・縮小（フェードアウト）させる
        const next = prev
          .map((b) => ({
            ...b,
            y: b.y - (0.8 + Math.random() * 1.2), // 60fps用の低速上昇
            radius: b.radius * 0.982,             // 60fps用のゆっくり縮小
          }))
          .filter((b) => b.radius > 2); // 半径が小さくなったら消滅

        // 一定確率で大釜の中心座標付近から新しい泡を生成
        if (Math.random() < 0.2) { // 60fps用の出現率調整
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 120; // 釜の半径（148）内に収まるように配置
          
          // 泡の色：現在の色、完成する薬の色、ゴールドのいずれかをランダムにブレンド
          const r = Math.random();
          const bubbleColor = r < 0.4 ? pendingResults.targetColorHex : (r < 0.8 ? "c8a84b" : "3d3d5c");

          next.push({
            x: width / 2 + Math.cos(angle) * dist,
            y: height * 0.64 + Math.sin(angle) * dist,
            radius: 8 + Math.random() * 18,
            color: colorNum(bubbleColor),
          });
        }
        return next;
      });

      // 液体そのものの色も明滅させて沸騰感・魔法エネルギーを表現
      if (frame % 15 === 0) { // 60fps用の点滅頻度調整 (約250msごと)
        setCauldronColorHex(() => {
          const r = Math.random();
          return r < 0.33 ? "3d3d5c" : (r < 0.66 ? pendingResults.targetColorHex : "c8a84b");
        });
      }
    }, 16); // 16ms (60 FPS) でぬるぬる動作

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isBrewing, pendingResults, width, height]);

  const handleClosePopup = () => {
    setBrewResults(null);
  };

  const handleSelectRecipe = (baseId: string, accentId: string) => {
    setSelectedBase(baseId);
    setSelectedAccent(accentId);
    setBrewCount(1);
  };

  const commands = useMemo<DrawCommand[]>(() => {
    const list: DrawCommand[] = [
      { type: "rect",   x: 0,               y: 0,              width,      height,      color: 0x0a0816 },
    ];

    // 1. 泡のパーティクルを先に描画リストに追加（これで大釜の本体やフチの裏側に描画されます）
    // 将来的に大釜が「画像（スプライトなど）」に置き換えられた場合も、
    // その大釜画像描画コマンドの前にこの泡コマンドをプッシュしておくことで、正常に画像の後ろから泡が立ち上ります。
    if (isBrewing) {
      for (const b of bubbles) {
        list.push({ type: "circle", x: b.x, y: b.y, radius: b.radius, color: b.color });
      }
    }

    // 2. 大釜本体およびフチを、状態カラー (cauldronColorHex) に基づき描画（泡より手前）
    // 液体を表す「丸い円 (circle)」は完全に削除し、釜自体が明滅・色変化するようにしています。
    list.push(
      { type: "rect",   x: width / 2 - 190, y: height * 0.52,  width: 380, height: 290, color: colorNum(cauldronColorHex) },
      { type: "rect",   x: width / 2 - 210, y: height * 0.52,  width: 420, height: 38,  color: colorNum(cauldronColorHex) }
    );

    // 3. 大釜の脚を描画（最手前）
    list.push(
      { type: "rect",   x: width / 2 - 168,  y: height * 0.80,  width: 38,  height: 58,  color: 0x1c1c2e },
      { type: "rect",   x: width / 2 + 130,  y: height * 0.80,  width: 38,  height: 58,  color: 0x1c1c2e }
    );

    return list;
  }, [width, height, cauldronColorHex, isBrewing, bubbles]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x0a0816} />

      {/* 演出中（isBrewing === true）は中央の調合パネルと棚を隠す */}
      {!isBrewing && (
        <>
          <PotionShelf />

          <BrewPanel
            selectedBase={selectedBase}
            selectedAccent={selectedAccent}
            onPickBase={() => setPickerOpen("base")}
            onPickAccent={() => setPickerOpen("accent")}
            result={null}
            onBrew={handleBrew}
            brewCount={brewCount}
            maxBrew={maxBrew}
            onBrewCountChange={setBrewCount}
          />
        </>
      )}

      {pickerOpen === "base" && !isBrewing && (
        <MaterialPickerPopup
          title="ベース材料"
          items={allBases}
          counts={materials}
          selectedId={selectedBase}
          onSelect={handleSelectBase}
          onClose={() => setPickerOpen(null)}
          suggestedItems={suggestedItems}
          suggestedRecipes={suggestedRecipes}
        />
      )}
      {pickerOpen === "accent" && !isBrewing && (
        <MaterialPickerPopup
          title="アクセント材料"
          items={allAccents}
          counts={materials}
          selectedId={selectedAccent}
          onSelect={handleSelectAccent}
          onClose={() => setPickerOpen(null)}
          suggestedItems={suggestedItems}
          suggestedRecipes={suggestedRecipes}
        />
      )}

      {brewResults !== null && (
        <BrewResultPopup results={brewResults} onClose={handleClosePopup} />
      )}

      {/* 演出中（isBrewing === true）はダイアログボックス（ツールバー含む）を隠す */}
      {!isBrewing && (
        <DialogueBox
          onRecipeSelect={handleSelectRecipe}
          actions={
            <ActionButton variant="secondary" onClick={advanceScene}>
              陳列へ →
            </ActionButton>
          }
        />
      )}

      {/* スキップ用のスクリーン全体オーバーレイ */}
      {isBrewing && (
        <div
          onClick={handleSkip}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 90,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className={css({
              position: "absolute",
              top: "100px",
              right: "40px",
              fontSize: "26px",
              color: "#c8a84b",
              fontWeight: "bold",
              textShadow: "0 2px 8px rgba(0,0,0,0.85)",
              pointerEvents: "none",
              letterSpacing: "0.15em"
            })}
          >
            クリックしてスキップする ≫
          </span>
        </div>
      )}
    </div>
  );
}