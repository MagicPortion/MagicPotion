import { css } from "#styled-system/css";
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
      <SlotBtn item={baseMaterial} placeholder="Base" label="Base素材を選ぶ" onClick={onClickBase} />
      <Sym>＋</Sym>
      <SlotBtn item={accentMaterial} placeholder="Accent" label="Accent素材を選ぶ" onClick={onClickAccent} />
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
      // width・height・border・backgroundは状態依存かつテーマと調和するためinline styleを使用
      style={{
        width: 220, height: 220,
        borderRadius: 20,
        border: item
          ? "2.5px solid rgba(200,168,75,0.85)"
          : "2.5px dashed rgba(255,255,255,0.4)",
        background: item ? "rgba(200,168,75,0.12)" : "rgba(8,5,20,0.92)",
      }}
      className={css({
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
        cursor: "pointer",
        transition: "all 0.15s",
        _hover: {
          borderColor: "rgba(200,168,75,0.95)",
          bg: "rgba(200,168,75,0.22)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(200,168,75,0.4)",
        },
      })}
    >
      {item ? (
        <>
          {/* カラーオーブ。colorHexが動的のためinline style */}
          <span style={{
            display: "block", width: 100, height: 100, borderRadius: "50%",
            backgroundColor: `#${item.colorHex}`,
            boxShadow: `0 2px 24px #${item.colorHex}aa`,
          }} />
          <span className={css({ fontSize: "32px", color: "#ffffff", fontWeight: "bold", textAlign: "center", px: "8px" })}>{item.name}</span>
        </>
      ) : (
        <span className={css({ fontSize: "32px", color: "rgba(255,255,255,0.75)", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.3 })}>
          {placeholder}<br />
          <span className={css({ fontSize: "24px", color: "#c8a84b", fontWeight: "bold" })}>選択</span>
        </span>
      )}
    </button>
  );
}

function ResultSlot({ result }: { result: BrewResult | null }) {
  if (!result) {
    return (
      // width・heightはSlotBtnとのレイアウト対称性維持のためinline style
      <div style={{
        width: 220, height: 250, borderRadius: 20,
        border: "2.5px dashed rgba(200,168,75,0.3)",
        background: "rgba(8,5,20,0.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span className={css({ fontSize: "48px", color: "rgba(200,168,75,0.4)", lineHeight: 1, fontWeight: "bold" })}>?</span>
      </div>
    );
  }
  return (
    // width・heightは他スロットとの一貫性維持のためinline style
    <div style={{
      width: 220, height: 250, borderRadius: 20,
      border: "2.5px solid rgba(200,168,75,0.95)",
      background: "rgba(8,5,20,0.95)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 10,
      animation: "resultPop 0.25s ease",
      padding: "16px 8px 12px",
    }}>
      {/* カラーオーブ。colorHexが動的のためinline style */}
      <span style={{
        display: "block", width: 100, height: 100, borderRadius: "50%",
        backgroundColor: `#${result.colorHex}`,
        boxShadow: `0 2px 28px #${result.colorHex}`,
        flexShrink: 0,
      }} />
      <span className={css({ fontSize: "32px", color: "#ffffff", fontWeight: "bold", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" })}>{result.name}</span>
      <span className={css({ fontSize: "26px", color: "#c8a84b", fontWeight: "bold", whiteSpace: "nowrap" })}>Lv.{result.level} / {result.sellPrice}G</span>
    </div>
  );
}

function Sym({ children }: { children: string }) {
  return (
    <span className={css({ fontSize: "44px", color: "#c8a84b", fontWeight: "bold", userSelect: "none", lineHeight: 1 })}>
      {children}
    </span>
  );
}
