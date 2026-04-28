import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useGameStore } from "../../../store/useGameStore";
import { THEMES, FONT_SIZE, SPEECH_BOTTOM, SPEECH_SIDE, type ThemeTokens } from "./dialogueThemes";

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
  const fontSize = FONT_SIZE[dialogueAppearance.fontSize];

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
      style={{
        position: "absolute",
        bottom: SPEECH_BOTTOM,
        left: SPEECH_SIDE,
        right: SPEECH_SIDE,
        zIndex: 51,
        background: t.bg,
        border: `2px solid ${t.border}`,
        borderRadius: 10,
        padding: "28px 36px 30px",
        userSelect: "none",
        cursor: showChoices ? "default" : "pointer",
      }}
    >
      {/* 話者名 */}
      <p style={{
        margin: "0 0 12px",
        fontSize: 13,
        fontWeight: "bold",
        color: t.nameText,
        letterSpacing: "0.16em",
      }}>
        ❖ {speakerName} ❖
      </p>

      {/* セリフ */}
      <p style={{
        margin: showChoices ? "0 0 16px" : "0 0 14px",
        fontSize,
        lineHeight: 1.8,
        color: t.text,
        letterSpacing: "0.03em",
        minHeight: `${fontSize * 1.8 * 2.5}px`,
      }}>
        <span ref={textRef} />
      </p>

      {/* 選択肢 */}
      {showChoices && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {choices!.map((c, i) => (
            <ChoiceButton key={i} label={c.label} onSelect={c.onSelect} t={t} fontSize={fontSize} />
          ))}
        </div>
      )}

      {/* 進むインジケーター ▼ バウンス（選択肢表示中は非表示） */}
      {!showChoices && (
        <p style={{
          margin: 0,
          textAlign: "right",
          fontSize: 20,
          color: t.nameText,
          animation: "advanceBounce 0.9s ease-in-out infinite",
          opacity: animating ? 0 : 1,
          transition: "opacity 0.3s",
          lineHeight: 1,
        }}>
          ▼
        </p>
      )}
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
      style={{
        display: "block",
        width: "100%",
        padding: "10px 20px",
        background: hovered ? t.choiceBgHover : t.choiceBg,
        border: `1px solid ${t.border}`,
        borderRadius: 6,
        color: t.text,
        fontSize: Math.round(fontSize * 0.78),
        cursor: "pointer",
        textAlign: "left",
        letterSpacing: "0.04em",
        transition: "background 0.15s",
      }}
    >
      ▷ {label}
    </button>
  );
}
