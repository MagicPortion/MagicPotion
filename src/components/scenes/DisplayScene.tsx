import { useEffect, useState } from "react";
import { css } from "#styled-system/css";
import { END_DAY, useGameStore } from "../../store/useGameStore";
import { getPotion } from "../../data/gameData";
import type { BrewedPotion } from "../../data/types";
import PotionSaleAnimation, { type AnimationSlot, ANIM } from "../ui/display/PotionSaleAnimation";
import SaleResultPopup from "../ui/display/SaleResultPopup";
import BlackoutDay from "../ui/display/BlackoutDay";

const GAME_W = 1920;
const GAME_H = 1080;
const CENTER_X = GAME_W / 2;
const CENTER_Y = GAME_H / 2 - 20;
const LINEUP_Y = GAME_H - 150;

type Phase = "animating" | "summary" | "blackout";

function buildSlots(potions: BrewedPotion[]): AnimationSlot[] {
  const n = potions.length;
  if (n === 0) return [];
  const spacing = Math.min(220, n === 1 ? 0 : (GAME_W - 400) / (n - 1));
  const originX = GAME_W / 2 - (spacing * (n - 1)) / 2;
  return potions.map((p, i) => {
    const lineupX = originX + i * spacing;
    return {
      id: p.instanceId,
      colorHex: getPotion(p.potionId)?.colorHex ?? "888888",
      lineupX,
      dx: CENTER_X - lineupX,
      dy: CENTER_Y - LINEUP_Y,
      sellPrice: p.sellPrice,
    };
  });
}

export default function DisplayScene() {
  const { brewedPotions, day, advanceScene, beginNextDayTransition } = useGameStore();

  const [snapshotPotions] = useState<BrewedPotion[]>(() => [...brewedPotions]);
  const [slots] = useState<AnimationSlot[]>(() => buildSlots(brewedPotions));
  const [phase, setPhase] = useState<Phase>("animating");
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (slots.length === 0) {
      const t = setTimeout(() => setPhase("summary"), 0);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setLaunched(true), ANIM.ENTER_DURATION + ANIM.ENTER_DELAY);
    const lastLaunch = (slots.length - 1) * ANIM.STAGGER;
    const t2 = setTimeout(
      () => setPhase("summary"),
      ANIM.ENTER_DURATION + ANIM.ENTER_DELAY + lastLaunch + ANIM.ARC_DURATION + ANIM.MONEY_DURATION + 400
    );
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slots.length]);

  useEffect(() => {
    if (phase !== "blackout") return;
    const shouldEnd = beginNextDayTransition();
    const t = setTimeout(() => advanceScene(shouldEnd), 600 + 2500 + 200);
    return () => clearTimeout(t);
  }, [phase, advanceScene, beginNextDayTransition]);

  const handleSummaryClose = () => {
    if (day >= END_DAY) {
      advanceScene(true);
      return;
    }
    setPhase("blackout");
  };

  return (
    <div
      className={css({ position: "fixed", inset: 0, overflow: "hidden" })}
      // 深夜の固定背景色のためinline style
      style={{ background: "#0d0d20" }}
    >
      {phase === "animating" && (
        <PotionSaleAnimation slots={slots} launched={launched} />
      )}
      {phase === "summary" && (
        <SaleResultPopup
          potions={snapshotPotions}
          onClose={handleSummaryClose}
          buttonLabel={day >= END_DAY ? "結果へ" : "翌朝へ →"}
        />
      )}
      {phase === "blackout" && <BlackoutDay day={day} />}
    </div>
  );
}
