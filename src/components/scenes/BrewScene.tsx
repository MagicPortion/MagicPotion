import { useMemo, useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, getMaterial, getPotion, colorNum } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import BrewPanel, { type BrewResult } from "../ui/brew/BrewPanel";
import MaterialPickerPopup from "../ui/brew/MaterialPickerPopup";
import BrewResultPopup from "../ui/brew/BrewResultPopup";
import PotionShelf from "../ui/brew/PotionShelf";
import { css } from "#styled-system/css";
import { playMergingSound, playMergeResultSound, stopMergingSound } from "../../utils/sound";
import witchBackground from "#assets/Back/WitchBack.png";

// 大釜の平常時の色（調合終了後はこの色に戻す）
const DEFAULT_CAULDRON_COLOR = "3d3d5c";

export default function BrewScene() {
  const { materials, brew, advanceScene, recipeLevel, setIsInventoryOpen } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<"base" | "accent" | null>(null);
  const [cauldronColorHex, setCauldronColorHex] = useState(DEFAULT_CAULDRON_COLOR);
  const [brewCount, setBrewCount] = useState(1);
  const [brewResults, setBrewResults] = useState<BrewResult[] | null>(null);
  const { width, height } = useWindowSize();
  // 大釜は画面下部中央に配置する
  const potCenterX = width / 2;
  const potCenterY = height * 0.82;

  // ── 調合アニメーション演出用の状態 ──
  const [isBrewing, setIsBrewing] = useState(false);
  const [pendingResults, setPendingResults] = useState<{ results: BrewResult[]; targetColorHex: string } | null>(null);
  const [bubbles, setBubbles] = useState<{ x: number; y: number; radius: number; color: number }[]>([]);
  // 素材を釜へ投げ入れる演出用の状態（開始位置→終了位置へ0→1で弧を描いて飛ばす）
  const [flyingItems, setFlyingItems] = useState<{ imageUrl: string; startX: number; startY: number; endX: number; endY: number; t: number }[]>([]);
  // 混ぜ棒がカクカクと震えながら回るステップ（滑らかに補間せず、コマ送りっぽく角度を飛ばす）
  const [stirStep, setStirStep] = useState(0);
  // 蝋燭の灯りのゆらぎ（常時、控えめにちらつかせる）
  const [candleAlpha, setCandleAlpha] = useState(0.3);

  useEffect(() => stopMergingSound, []);

  // 蝋燭明かりのゆらぎループ（演出中でなくても常時ちらつかせる）
  useEffect(() => {
    const id = setInterval(() => {
      setCandleAlpha(0.22 + Math.random() * 0.18);
    }, 130);
    return () => clearInterval(id);
  }, []);

  const allBases   = MATERIALS.filter((m) => m.category === "base");
  const allAccents = MATERIALS.filter((m) => m.category === "accent");

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
        // isNew はバッチ内の最初の1本のみ立てる、isNewRecipe も最初の1本のみ（2本目以降は既知として扱う）
        results.push({
          name: potionDef.name,
          colorHex: potionDef.colorHex,
          level: brewed.level,
          sellPrice: brewed.sellPrice,
          isNew: i === 0 && brewed.isNew,
          isNewRecipe: i === 0 && brewed.isNewRecipe,
          isFailed: brewed.isFailed,
        });
      }
    }
    if (results.length > 0) {
      // 演出フェーズの開始。即時結果は表示せず、状態を一時保存して演出をONにする
      playMergingSound();

      // 選んだ素材（Base・Accent）のアイコンを、パネルの位置から釜の口へ投げ入れる演出を仕込む
      const baseMaterial = getMaterial(selectedBase);
      const accentMaterial = getMaterial(selectedAccent);
      const potMouthX = potCenterX;
      const potMouthY = potCenterY - 108;
      const newFlyingItems: typeof flyingItems = [];
      if (baseMaterial) {
        newFlyingItems.push({ imageUrl: baseMaterial.imageUrl, startX: width / 2 - 360, startY: height / 2 - 80, endX: potMouthX - 20, endY: potMouthY, t: 0 });
      }
      if (accentMaterial) {
        newFlyingItems.push({ imageUrl: accentMaterial.imageUrl, startX: width / 2 - 10, startY: height / 2 - 80, endX: potMouthX + 20, endY: potMouthY, t: 0 });
      }
      setFlyingItems(newFlyingItems);

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
    setCauldronColorHex(DEFAULT_CAULDRON_COLOR);
    setBrewResults(pendingResults.results);
    stopMergingSound();
    playMergeResultSound();
    setPendingResults(null);
    setBubbles([]);
    setFlyingItems([]);
  };

  // 演出用タイマーと泡パーティクルアニメーションループ
  useEffect(() => {
    if (!isBrewing || !pendingResults) {
      return;
    }

    const results = pendingResults.results;
    const targetColorHex = pendingResults.targetColorHex;

    // 2秒（2000ms）で自動的に調合ポップアップ表示へ遷移
    const timeout = setTimeout(() => {
      setIsBrewing(false);
      setCauldronColorHex(DEFAULT_CAULDRON_COLOR);
      setBrewResults(results);
      stopMergingSound();
      playMergeResultSound();
      setPendingResults(null);
      setBubbles([]);
      setFlyingItems([]);
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

        // 一定確率で大釜の口（液面）付近から新しい泡を生成
        if (Math.random() < 0.2) { // 60fps用の出現率調整
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 85; // 口の半径内に収まるように配置

          // 泡の色：現在の色、完成する薬の色、ゴールドのいずれかをランダムにブレンド
          const r = Math.random();
          const bubbleColor = r < 0.4 ? targetColorHex : (r < 0.8 ? "c8a84b" : "3d3d5c");

          next.push({
            x: potCenterX + Math.cos(angle) * dist,
            y: potCenterY - 108 + Math.sin(angle) * dist * 0.3,
            radius: 8 + Math.random() * 18,
            color: colorNum(bubbleColor),
          });
        }
        return next;
      });

      // 投げ入れた素材を釜の口へ向けて弧を描いて飛ばす。着地したら泡の飛沫を発生させる
      setFlyingItems((prev) => {
        if (prev.length === 0) return prev;
        const next: typeof prev = [];
        const landed: typeof prev = [];
        for (const item of prev) {
          const nt = item.t + 0.06; // 約16フレーム（約270ms）で着地
          if (nt >= 1) {
            landed.push(item);
          } else {
            next.push({ ...item, t: nt });
          }
        }
        if (landed.length > 0) {
          setBubbles((bprev) => [
            ...bprev,
            ...landed.flatMap((item) =>
              Array.from({ length: 6 }, () => ({
                x: item.endX + (Math.random() - 0.5) * 50,
                y: item.endY + (Math.random() - 0.5) * 20,
                radius: 10 + Math.random() * 16,
                color: colorNum(targetColorHex),
              }))
            ),
          ]);
        }
        return next;
      });

      // 液体そのものの色も明滅させて沸騰感・魔法エネルギーを表現
      if (frame % 15 === 0) { // 60fps用の点滅頻度調整 (約250msごと)
        setCauldronColorHex(() => {
          const r = Math.random();
          return r < 0.33 ? "3d3d5c" : (r < 0.66 ? targetColorHex : "c8a84b");
        });
      }

      // 混ぜ棒の角度をコマ送りで飛ばして、なめらかに回さずカクカクと震える見た目にする
      if (frame % 8 === 0) {
        setStirStep((s) => (s + 1) % 8);
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
      // 0. 魔女の背景（夜なので暗く落として、蝋燭の灯りだけがぼんやり点る雰囲気にする）
      { type: "image", x: 0, y: 0, width, height, imageSrc: witchBackground },
      { type: "rect",  x: 0, y: 0, width, height, color: 0x05040c, alpha: 0.78 },
      // 蝋燭の灯りのゆらぎ（大釜の周り、控えめな暖色の光だまり）
      { type: "ellipse", x: potCenterX, y: potCenterY - 60, radiusX: 240, radiusY: 190, color: 0xffb35c, alpha: candleAlpha * 0.35 },
      { type: "ellipse", x: potCenterX, y: potCenterY - 60, radiusX: 130, radiusY: 105, color: 0xffcf8a, alpha: candleAlpha * 0.5 },
    ];

    // 1. 泡のパーティクルを先に描画リストに追加（これで大釜の本体やフチの裏側に描画されます）
    // 将来的に大釜が「画像（スプライトなど）」に置き換えられた場合も、
    // その大釜画像描画コマンドの前にこの泡コマンドをプッシュしておくことで、正常に画像の後ろから泡が立ち上ります。
    if (isBrewing) {
      for (const b of bubbles) {
        list.push({ type: "circle", x: b.x, y: b.y, radius: b.radius, color: b.color });
      }
    }

    // 2. 大釜本体を丸みを帯びた楕円形で描画し、状態カラー (cauldronColorHex) に基づき色変化させる
    // 液体を表す「丸い円 (circle)」は完全に削除し、釜自体が明滅・色変化するようにしている。
    const potColor = colorNum(cauldronColorHex);
    list.push(
      // 丸くふくらんだ胴体
      { type: "ellipse", x: potCenterX, y: potCenterY, radiusX: 165, radiusY: 130, color: potColor },
      // 上部の縁（フチ）：胴体より少し張り出させ、鉄製の魔法の釜らしい厚みを出す
      { type: "ellipse", x: potCenterX, y: potCenterY - 108, radiusX: 138, radiusY: 34, color: 0x2b2b40 },
      // 口元のすぼまり（内側の暗がり）
      { type: "ellipse", x: potCenterX, y: potCenterY - 108, radiusX: 108, radiusY: 26, color: 0x14101c },
      // 口の中の液面
      { type: "ellipse", x: potCenterX, y: potCenterY - 108, radiusX: 97, radiusY: 19, color: potColor },
      // 左上のハイライトで丸みを強調
      { type: "ellipse", x: potCenterX - 75, y: potCenterY - 50, radiusX: 46, radiusY: 34, color: 0xffffff, alpha: 0.1 },
      // 持ち手（フチの少し上、細く短い輪っか）
      { type: "ellipse", x: potCenterX - 118, y: potCenterY - 122, radiusX: 16, radiusY: 13, color: 0x2b2b40, filled: false, lineWidth: 5 },
      { type: "ellipse", x: potCenterX + 118, y: potCenterY - 122, radiusX: 16, radiusY: 13, color: 0x2b2b40, filled: false, lineWidth: 5 },
      // 胴体側面の持ち手（少し上の位置、胴体と同じ色で太く短い輪っか）
      { type: "ellipse", x: potCenterX - 160, y: potCenterY - 40, radiusX: 13, radiusY: 11, color: potColor, filled: false, lineWidth: 9 },
      { type: "ellipse", x: potCenterX + 160, y: potCenterY - 40, radiusX: 13, radiusY: 11, color: potColor, filled: false, lineWidth: 9 }
    );

    // 3. 大釜の脚を描画（最手前）：胴体と同じ色にして一体感を出し、3本脚を胴体の下にぐっと寄せる
    list.push(
      { type: "rect",   x: potCenterX - 88,  y: potCenterY + 90,  width: 28,  height: 46, cornerRadius: 8, color: potColor },
      { type: "rect",   x: potCenterX + 60,  y: potCenterY + 90,  width: 28,  height: 46, cornerRadius: 8, color: potColor },
      { type: "rect",   x: potCenterX - 17,  y: potCenterY + 100, width: 34,  height: 52, cornerRadius: 9, color: potColor }
    );

    // 4. 混ぜ棒（演出中のみ）：なめらかに回さず、コマ送りの角度でカクカクと震えながら混ぜている見た目にする
    if (isBrewing) {
      const stirAngle = (stirStep / 8) * Math.PI * 2;
      const stirRadius = 50;
      const tipX = potCenterX + 12 + Math.cos(stirAngle) * stirRadius;
      const tipY = potCenterY - 110 + Math.sin(stirAngle) * stirRadius * 0.4;
      const handleX = potCenterX + 130;
      const handleY = potCenterY - 230;
      list.push(
        { type: "line", x: handleX, y: handleY, x2: tipX, y2: tipY, lineWidth: 11, color: 0x6b4a2f },
        { type: "circle", x: tipX, y: tipY, radius: 7, color: 0x4a3320 }
      );
    }

    // 5. 釜へ投げ入れられる素材（放物線を描いて口へ落ちていき、着地手前で少し縮む）
    for (const item of flyingItems) {
      const t = item.t;
      const x = item.startX + (item.endX - item.startX) * t;
      const arcHeight = 220;
      const y = item.startY + (item.endY - item.startY) * t - Math.sin(t * Math.PI) * arcHeight;
      const size = 150 - 90 * t;
      list.push({ type: "image", x: x - size / 2, y: y - size / 2, width: size, height: size, imageSrc: item.imageUrl });
    }

    return list;
  }, [width, height, cauldronColorHex, isBrewing, bubbles, stirStep, candleAlpha, flyingItems]);

  return (
    <div style={{ width, height }} className={css({ position: "relative", overflow: "hidden" })}>
      <PixiCanvas commands={commands} backgroundColor={0x05040c} />

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
            recipeLevel={recipeLevel}
          />
        </>
      )}

      {pickerOpen === "base" && !isBrewing && (
        <MaterialPickerPopup
          title="Base 素材"
          items={allBases}
          counts={materials}
          selectedId={selectedBase}
          onSelect={handleSelectBase}
          onClose={() => setPickerOpen(null)}
        />
      )}
      {pickerOpen === "accent" && !isBrewing && (
        <MaterialPickerPopup
          title="Accent 素材"
          items={allAccents}
          counts={materials}
          selectedId={selectedAccent}
          onSelect={handleSelectAccent}
          onClose={() => setPickerOpen(null)}
        />
      )}

      {brewResults !== null && (
        <BrewResultPopup results={brewResults} onClose={handleClosePopup} />
      )}

      {/* 演出中（isBrewing === true）はダイアログボックス（ツールバー含む）を隠す */}
      {!isBrewing && (
        <DialogueBox
          onRecipeSelect={handleSelectRecipe}
          onInventory={() => setIsInventoryOpen(true)}
          actions={
            <ActionButton variant="secondary" onClick={advanceScene}>
              販売へ →
            </ActionButton>
          }
        />
      )}

      {/* スキップ用のスクリーン全体オーバーレイ */}
      {isBrewing && (
        <div
          onClick={handleSkip}
          className={css({
            position: "absolute",
            inset: 0,
            zIndex: 90,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
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
