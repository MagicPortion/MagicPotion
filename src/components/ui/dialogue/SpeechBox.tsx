import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useGameStore } from "../../../store/useGameStore";
import { THEMES, type ThemeTokens } from "./dialogueThemes";
import { css } from "#styled-system/css";

export interface SpeechBoxHandle {
  click: () => void;
}

export interface Choice {
  label: string;
  onSelect: () => void;
}

interface SpeechBoxProps {
  speakerName: string;
  text: string;
  onAdvance: () => void;
  choices?: Choice[];
}

const SpeechBox = forwardRef<SpeechBoxHandle, SpeechBoxProps>(function SpeechBox(
  { speakerName, text, onAdvance, choices },
  ref
) {
  const { dialogueAppearance } = useGameStore();
  const t = THEMES[dialogueAppearance.theme];
  const fontSize = 34;

  const textRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    animRef.current?.pause();
    el.innerHTML = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? " " : char;
      span.style.opacity = "0";
      el.appendChild(span);
    });
    setAnimating(true);
    animRef.current = animate(el.querySelectorAll("span"), {
      opacity: [0, 1],
      delay: stagger(28),
      duration: 1,
      ease: "linear",
      onComplete: () => setAnimating(false),
    });
  }, [text]);

  const showChoices = !!choices && choices.length > 0 && !animating;

  const handleClick = () => {
    if (showChoices) return;
    if (animating) {
      animRef.current?.pause();
      textRef.current
        ?.querySelectorAll("span")
        .forEach((s) => ((s as HTMLElement).style.opacity = "1"));
      setAnimating(false);
    } else {
      onAdvance();
    }
  };

  useImperativeHandle(ref, () => ({ click: handleClick }));

  return (
    <div
      className={css({
        position: "absolute",
        bottom: "80px",
        left: "24px",
        right: "24px",
        zIndex: 49,
        pointerEvents: "none",
      })}
    >
      <div className={css({ display: "flex", flexDirection: "column", gap: "8px", alignItems: "stretch" })}>
        {/* 話者名（ボックスとは別に上に表示） */}
        <div
          aria-hidden
          className={css({
            alignSelf: "flex-start",
            pointerEvents: "none",
            borderRadius: "8px",
            px: "12px",
            py: "6px",
            fontWeight: "bold",
            letterSpacing: "0.16em",
            userSelect: "none",
          })}
          style={{
            fontSize: `${Math.round(fontSize * 1.15)}px`,
            background: t.bg,
            border: `2px solid ${t.border}`,
            color: t.nameText,
          }}
        >
          ❖ {speakerName} ❖
        </div>

        {/* 会話ボックス本体 */}
        <div
          onClick={handleClick}
          className={css({
            borderRadius: "10px",
            px: "36px",
            pt: "28px",
            pb: "30px",
            userSelect: "none",
            pointerEvents: "auto",
          })}
          style={{
            cursor: showChoices ? "default" : "pointer",
            background: t.bg,
            border: `2px solid ${t.border}`,
          }}
        >
          {/* セリフ */}
          <p
            className={css({
              lineHeight: 1.8,
              letterSpacing: "0.03em",
            })}
            style={{
              margin: showChoices ? "0 0 16px" : "0 0 14px",
              fontSize: `${fontSize}px`,
              minHeight: `${fontSize * 1.8 * 2.5}px`,
              color: t.text,
            }}
          >
            <span ref={textRef} />
          </p>

          {/* 選択肢 */}
          {showChoices && (
            <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
              {choices!.map((c, i) => (
                <ChoiceButton key={i} label={c.label} onSelect={c.onSelect} t={t} fontSize={fontSize} />
              ))}
            </div>
          )}

          {/* 進むインジケーター ▼ バウンス（選択肢表示中は非表示） */}
          {!showChoices && (
            <p
              className={css({
                textAlign: "right",
                animation: "advanceBounce 0.9s ease-in-out infinite",
                transition: "opacity 0.3s",
                lineHeight: 1,
                m: 0,
              })}
              style={{
                fontSize: "20px",
                opacity: animating ? 0 : 1,
                color: t.nameText,
              }}
            >
              ▼
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default SpeechBox;

function ChoiceButton({
  label, onSelect, t, fontSize,
}: {
  label: string;
  onSelect: () => void;
  t: ThemeTokens;
  fontSize: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={css({
        display: "block",
        width: "100%",
        px: "20px",
        py: "10px",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "left",
        letterSpacing: "0.04em",
        transition: "background 0.15s",
      })}
      style={{
        background: hovered ? t.choiceBgHover : t.choiceBg,
        fontSize: `${Math.round(fontSize * 0.78)}px`,
        border: `1px solid ${t.border}`,
        color: t.text,
      }}
    >
      ▷ {label}
    </button>
  );
}
