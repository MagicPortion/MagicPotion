import { useState, useEffect } from "react";
import { GAME_W, GAME_H } from "./gameConstants";

function calc() {
  return Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H);
}

export function useGameScale() {
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}
