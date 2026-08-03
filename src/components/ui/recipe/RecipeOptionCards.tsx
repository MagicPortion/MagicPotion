import { useState } from "react";
import { css } from "#styled-system/css";
import type { PotionDef } from "../../../data/types";
import ColorOrb from "../common/ColorOrb";
import ItemCard from "../common/ItemCard";
import { SEMANTIC } from "../dialogue/dialogueThemes";
import { useUITheme } from "../../../hooks/useUITheme";

export interface RecipeOption {
  id: string;
  potion: PotionDef;
  level: number;
  nextLevel: number;
  nextPrice: number;
}

interface RecipeOptionCardsProps {
  options: RecipeOption[];
  onLearn: (id: string) => void;
}

const CARD_SIZE = 180;
const AREAS = ["a", "b", "c", "d", "e"];

export default function RecipeOptionCards({ options, onLearn }: RecipeOptionCardsProps) {
  const t = useUITheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onLearn(selectedId);
    }
  };

  return (
    <div
      className={css({
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div
        style={{ background: t.bg, borderColor: t.border }}
        className={css({
          border: "6px solid",
          borderRadius: "12px",
          p: "32px 40px 24px 40px", // 決定ボタン用に下の余白を少し調整
          boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
          backdropFilter: "blur(2px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
          width: "750px", // 決定ボタンの配置を安定させるため幅を固定（必要に応じて調整してください）
          ml: "-750px",
        })}
      >
        <div className={css({ mb: "12px", width: "100%", textAlign: "center" })}>
          <div
            style={{ background: t.bgSoft, color: t.nameText, borderColor: t.border }}
            className={css({ position: "relative", width: "400px", mx: "auto", border: "1px solid", fontSize: "36px", fontWeight: "bold", pl: "80px", pr: "80px", pt: "12px", pb: "12px", borderRadius: "10px", letterSpacing: "0.2em", boxShadow: "0 12px 36px rgba(0,0,0,0.55)" })}
          >
            レシピ選択
          </div>
          <p style={{ color: t.text }} className={css({ fontSize: "24px", m: "12px 0 0" })}>
            獲得するレシピを1つ選んでね
          </p>
        </div>

        {/* グリッドコンテナ */}
        <div
          className={css({ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "25px" })}
          style={{ gridTemplateAreas: `"a a b b c c" ". d d e e ."` }}
        >
          {options.map((opt, i) => {
            const isKnown = opt.level > 0;
            const isSelected = selectedId === opt.id;

            return (
              <div key={opt.id} style={{ gridArea: AREAS[i] }}>
                <ItemCard
                  visual={<ColorOrb colorHex={opt.potion.colorHex} image={opt.potion.image} size={150} />}
                  label={<PotionName name={opt.potion.name} />}
                  labelLines={2}
                  size={CARD_SIZE}
                  onClick={() => setSelectedId(opt.id)}
                  selected={isSelected}
                  borderColor={isSelected ? t.nameText : (isKnown ? t.border : t.borderMuted)}
                  labelColor={t.text}
                  footer={
                    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", mt: "8px" })}>
                      <span style={{ color: t.nameText }} className={css({ fontSize: "22px" })}>{opt.nextPrice}G</span>
                      <span
                        style={{
                          background: t.surface,
                          borderColor: isKnown ? SEMANTIC.danger : SEMANTIC.success,
                          color: isKnown ? SEMANTIC.dangerBorder : SEMANTIC.successText,
                        }}
                        className={css({
                          fontSize: "22px", fontWeight: "bold",
                          px: "10px", py: "3px", borderRadius: "20px",
                          border: "1px solid",
                          whiteSpace: "nowrap",
                        })}
                      >
                        {isKnown ? `Lv.${opt.level} → ${opt.nextLevel}` : "Lv.1 習得"}
                      </span>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>

        {/* 右下に決定ボタンを配置するエリア */}
        <div className={css({ display: "flex", justifyContent: "flex-end", width: "100%", mt: "2px" })}>
          <button
            onClick={handleConfirm}
            disabled={!selectedId} // 何も選択されていないときは押せない
            style={{
              color: selectedId ? t.surface : t.subtleText,
              background: selectedId ? t.nameText : t.surface,
              borderColor: selectedId ? t.nameText : t.borderMuted,
              cursor: selectedId ? "pointer" : "not-allowed",
            }}
            className={css({
              fontSize: "26px",
              fontWeight: "bold",
              border: "1px solid",
              borderRadius: "12px",
              padding: "12px 36px",
              boxShadow: selectedId ? "0 4px 14px rgba(200,168,75,0.24)" : "none",
              transition: "all 0.15s",
              _hover: selectedId ? {
                filter: "brightness(1.1)",
                transform: "translateY(-2px)",
              } : {},
              _active: selectedId ? {
                transform: "translateY(1px)",
              } : {},
            })}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
}

function PotionName({ name }: { name: string }) {
  const suffix = "ポーション";

  if (!name.endsWith(suffix)) {
    return name;
  }

  return (
    <>
      {name.slice(0, -suffix.length)}
      <br />
      {suffix}
    </>
  );
}
