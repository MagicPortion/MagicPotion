import { css } from "../../../../styled-system/css";
import { MATERIALS } from "../../../data/gameData";
import BrewEquation from "./BrewEquation";

export interface BrewResult {
  name: string;
  colorHex: string;
  level: number;
  sellPrice: number;
}

interface BrewPanelProps {
  selectedBase: string | null;
  selectedAccent: string | null;
  onPickBase: () => void;
  onPickAccent: () => void;
  result: BrewResult | null;
  onBrew: () => void;
  brewCount: number;
  maxBrew: number;
  onBrewCountChange: (n: number) => void;
}

export default function BrewPanel({
  selectedBase, selectedAccent,
  onPickBase, onPickAccent,
  result, onBrew,
  brewCount, maxBrew, onBrewCountChange,
}: BrewPanelProps) {
  const baseMaterial   = selectedBase   ? (MATERIALS.find((m) => m.id === selectedBase)   ?? null) : null;
  const accentMaterial = selectedAccent ? (MATERIALS.find((m) => m.id === selectedAccent) ?? null) : null;
  const canBrew = !!selectedBase && !!selectedAccent;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        width: 800,
      }}
      className={css({
        bg: "rgba(8,6,18,0.93)",
        borderRadius: "22px",
        p: "44px 52px 40px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
        border: "1px solid rgba(100,80,180,0.25)",
      })}
    >
      <p style={{ fontSize: 11, color: "#5a4a80", letterSpacing: "0.2em", margin: "0 0 20px", textAlign: "center", textTransform: "uppercase" }}>
        スロットを選んで素材を指定してください
      </p>

      {/* 式: [ベース] ＋ [アクセント] ＝ [結果] */}
      <BrewEquation
        baseMaterial={baseMaterial}
        accentMaterial={accentMaterial}
        result={result}
        onClickBase={onPickBase}
        onClickAccent={onPickAccent}
      />

      {/* 個数ステッパー (maxBrew > 1 のとき表示) */}
      {canBrew && maxBrew > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24 }}>
          <button
            onClick={() => onBrewCountChange(Math.max(1, brewCount - 1))}
            style={{ background: "rgba(200,168,75,0.12)", border: "1px solid rgba(200,168,75,0.3)", color: "#c8a84b", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
            className={css({ _hover: { bg: "rgba(200,168,75,0.22)" }, transition: "background 0.12s" })}
          >
            −
          </button>
          <span style={{ fontSize: 18, color: "#e8d8b8", minWidth: 80, textAlign: "center", fontWeight: "bold" }}>
            ×{brewCount}
            <span style={{ fontSize: 12, color: "#5a4a80", fontWeight: "normal", marginLeft: 6 }}>/ 最大{maxBrew}</span>
          </span>
          <button
            onClick={() => onBrewCountChange(Math.min(maxBrew, brewCount + 1))}
            style={{ background: "rgba(200,168,75,0.12)", border: "1px solid rgba(200,168,75,0.3)", color: "#c8a84b", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
            className={css({ _hover: { bg: "rgba(200,168,75,0.22)" }, transition: "background 0.12s" })}
          >
            ＋
          </button>
          {brewCount < maxBrew && (
            <button
              onClick={() => onBrewCountChange(maxBrew)}
              style={{ background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.2)", color: "#8b7a5c", fontSize: 12, padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}
              className={css({ _hover: { color: "#c8a84b", bg: "rgba(200,168,75,0.15)" }, transition: "all 0.12s" })}
            >
              全部
            </button>
          )}
        </div>
      )}

      {/* 調合ボタン */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <button
          onClick={onBrew}
          disabled={!canBrew}
          style={{
            background: canBrew ? "#8B6914" : "rgba(30,20,8,0.4)",
            border: `2px solid ${canBrew ? "#c8a84b" : "#2a1808"}`,
            color: canBrew ? "#1a0e06" : "#3a2810",
            opacity: canBrew ? 1 : 0.5,
          }}
          className={css({
            display: "flex", alignItems: "center", justifyContent: "center",
            px: "72px", py: "18px",
            fontSize: "20px", fontWeight: "bold",
            borderRadius: "10px",
            cursor: "pointer",
            letterSpacing: "0.1em",
            transition: "all 0.15s",
            _hover: { filter: "brightness(1.15)" },
            _disabled: { cursor: "not-allowed", _hover: { filter: "none" } },
          })}
        >
          {canBrew && maxBrew > 1 && brewCount > 1 ? `×${brewCount} 調合する！` : "調合する！"}
        </button>
      </div>
    </div>
  );
}
