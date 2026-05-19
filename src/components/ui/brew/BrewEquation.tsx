import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";
import type { BrewResult } from "./BrewPanel";

interface BrewEquationProps {
  baseMaterial: MaterialDef | null;
  accentMaterial: MaterialDef | null;
  result: BrewResult | null;
  onClickBase: () => void;
  onClickAccent: () => void;
}

export default function BrewEquation({
  baseMaterial, accentMaterial, result,
  onClickBase, onClickAccent,
}: BrewEquationProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <SlotBtn item={baseMaterial} placeholder="ベース" label="ベース材料を選ぶ" onClick={onClickBase} />
      <Sym>＋</Sym>
      <SlotBtn item={accentMaterial} placeholder="アクセント" label="アクセント材料を選ぶ" onClick={onClickAccent} />
      <Sym>＝</Sym>
      <ResultSlot result={result} />
    </div>
  );
}

function SlotBtn({
  item, placeholder, label, onClick,
}: {
  item: MaterialDef | null;
  placeholder: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 130, height: 130,
        borderRadius: 14,
        border: item
          ? "2px solid rgba(200,168,75,0.6)"
          : "2px dashed rgba(255,255,255,0.22)",
        background: item ? "rgba(200,168,75,0.08)" : "rgba(255,255,255,0.025)",
      }}
      className={css({
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "10px",
        cursor: "pointer",
        transition: "all 0.15s",
        _hover: {
          borderColor: "rgba(200,168,75,0.9)",
          bg: "rgba(200,168,75,0.12)",
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(200,168,75,0.2)",
        },
      })}
    >
      {item ? (
        <>
          <span style={{
            display: "block", width: 68, height: 68, borderRadius: "50%",
            backgroundColor: `#${item.colorHex}`,
            boxShadow: `0 2px 18px #${item.colorHex}88`,
          }} />
          <span style={{ fontSize: 14, color: "#e8d8b8" }}>{item.name}</span>
        </>
      ) : (
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.5 }}>
          {placeholder}<br />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>タップして選ぶ</span>
        </span>
      )}
    </button>
  );
}

function ResultSlot({ result }: { result: BrewResult | null }) {
  if (!result) {
    return (
      <div style={{
        width: 130, height: 130, borderRadius: 14,
        border: "2px dashed rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.015)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 44, color: "rgba(255,255,255,0.10)", lineHeight: 1 }}>?</span>
      </div>
    );
  }
  return (
    <div style={{
      width: 130, height: 130, borderRadius: 14,
      border: "2px solid rgba(200,168,75,0.9)",
      background: "rgba(200,168,75,0.12)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 7,
      animation: "resultPop 0.25s ease",
    }}>
      <span style={{
        display: "block", width: 68, height: 68, borderRadius: "50%",
        backgroundColor: `#${result.colorHex}`,
        boxShadow: `0 2px 28px #${result.colorHex}`,
      }} />
      <span style={{ fontSize: 13, color: "#c8a84b", fontWeight: "bold" }}>{result.name}</span>
      <span style={{ fontSize: 11, color: "#8b7a5c" }}>Lv.{result.level} / {result.sellPrice}G</span>
    </div>
  );
}

function Sym({ children }: { children: string }) {
  return (
    <span style={{ fontSize: 38, color: "rgba(200,168,75,0.38)", fontWeight: "bold", userSelect: "none", lineHeight: 1 }}>
      {children}
    </span>
  );
}
