import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animate, stagger } from "animejs";
import { useGameStore } from "../../store/useGameStore";
import SettingsPopup from "../popups/SettingsPopup";
import HintPopup from "../popups/HintPopup";
import RecipeBookPopup from "../popups/RecipeBookPopup";

export interface DialogueBoxHandle {
  click: () => void;
}

interface DialogueBoxProps {
  // Full dialogue mode (all optional — omit for toolbar-only)
  speakerName?: string;
  text?: string;
  onAdvance?: () => void;
  advanceLabel?: string;
  // Scene-specific action buttons (shown right side in toolbar-only mode)
  actions?: ReactNode;
  // Quick-set callback for RecipeBookPopup in BrewScene
  onRecipeSelect?: (baseId: string, accentId: string) => void;
}

// Theme palette
const THEMES = {
  dark: {
    bg: "rgba(10,6,2,0.93)",
    border: "#8B6914",
    inner: "rgba(139,105,20,0.35)",
    text: "#e8d8b8",
    nameBg: "#1a0e06",
    nameText: "#c8a84b",
    btnBg: "rgba(26,14,6,0.9)",
    btnBorder: "#4a3810",
    btnText: "#c8a84b",
  },
  parchment: {
    bg: "rgba(240,220,170,0.96)",
    border: "#7a4a10",
    inner: "rgba(122,74,16,0.25)",
    text: "#2c1810",
    nameBg: "rgba(122,74,16,0.15)",
    nameText: "#7a4a10",
    btnBg: "rgba(122,74,16,0.12)",
    btnBorder: "#7a4a10",
    btnText: "#7a4a10",
  },
  semi: {
    bg: "rgba(10,6,2,0.68)",
    border: "rgba(139,105,20,0.55)",
    inner: "rgba(139,105,20,0.20)",
    text: "#f0e8d0",
    nameBg: "rgba(26,14,6,0.8)",
    nameText: "#c8a84b",
    btnBg: "rgba(26,14,6,0.7)",
    btnBorder: "rgba(139,105,20,0.45)",
    btnText: "#c8a84b",
  },
} as const;

const FONT_SIZE = { normal: 24, large: 30, xl: 38 } as const;

// ── Exported helper button for scene action slots ─────────────────────────
export function ActionButton({
  onClick,
  disabled,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: variant === "primary" ? "#8B6914" : "rgba(26,14,6,0.85)",
        border: `1px solid ${variant === "primary" ? "#c8a84b" : "#4a3810"}`,
        borderRadius: 4,
        padding: "10px 26px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: variant === "primary" ? "bold" : "normal",
        color: variant === "primary" ? "#1a0e06" : "#c8a84b",
        letterSpacing: "0.06em",
        opacity: disabled ? 0.4 : 1,
        whiteSpace: "nowrap",
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const DialogueBox = forwardRef<DialogueBoxHandle, DialogueBoxProps>(
  function DialogueBox(
    { speakerName, text, onAdvance, advanceLabel = "▶ 次へ", actions, onRecipeSelect },
    ref
  ) {
    const { dialogueAppearance: appearance, setDialogueAppearance } = useGameStore();
    const t = THEMES[appearance.theme];
    const fontSize = FONT_SIZE[appearance.fontSize];

    const textRef = useRef<HTMLSpanElement>(null);
    const animRef = useRef<ReturnType<typeof animate> | null>(null);
    const [animating, setAnimating] = useState(false);
    const [openPopup, setOpenPopup] = useState<"settings" | "hint" | "recipe" | null>(null);

    const fullMode = !!text;

    // Typewriter effect
    useEffect(() => {
      if (!fullMode) return;
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
    }, [text, fullMode]);

    const handleClick = () => {
      if (!fullMode) return;
      if (openPopup !== null) return; // ポップアップ中はスルー
      if (animating) {
        animRef.current?.pause();
        textRef.current
          ?.querySelectorAll("span")
          .forEach((s) => ((s as HTMLElement).style.opacity = "1"));
        setAnimating(false);
      } else {
        onAdvance?.();
      }
    };

    useImperativeHandle(ref, () => ({ click: handleClick }));

    // ツールバーの高さ（テキストボックスの bottom 値）
    const TOOLBAR_H = 68;

    return (
      <>
        {/* ── テキストボックス（会話モードのみ） ── */}
        {fullMode && (
          <div
            style={{
              position: "absolute",
              bottom: TOOLBAR_H,
              left: 0,
              right: 0,
              zIndex: 51,
              background: t.bg,
              borderTop: `2px solid ${t.border}`,
              boxShadow: "0 -6px 28px rgba(0,0,0,0.55)",
              padding: "22px 64px 26px",
              userSelect: "none",
            }}
          >
            {/* 話者名 */}
            <p style={{
              margin: "0 0 16px",
              fontSize: 15,
              fontWeight: "bold",
              color: t.nameText,
              letterSpacing: "0.18em",
            }}>
              ❖ {speakerName} ❖
            </p>
            {/* セリフ */}
            <p style={{
              margin: 0,
              fontSize,
              lineHeight: 1.85,
              color: t.text,
              letterSpacing: "0.04em",
            }}>
              <span ref={textRef} />
            </p>
          </div>
        )}

        {/* ── ツールバー（常に表示） ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            height: TOOLBAR_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            background: t.bg,
            borderTop: `2px solid ${t.border}`,
            boxShadow: "0 -4px 24px rgba(0,0,0,0.65)",
            userSelect: "none",
          }}
        >
          {/* 左：標準ボタン */}
          <div style={{ display: "flex", gap: 8 }}>
            <ToolBtn label="⚙ 設定"  onClick={() => setOpenPopup("settings")} bg={t.btnBg} border={t.btnBorder} color={t.btnText} />
            <ToolBtn label="❓ ヒント" onClick={() => setOpenPopup("hint")}     bg={t.btnBg} border={t.btnBorder} color={t.btnText} />
            <ToolBtn label="📜 レシピ" onClick={() => setOpenPopup("recipe")}   bg={t.btnBg} border={t.btnBorder} color={t.btnText} />
          </div>

          {/* 右：進む表示 or シーンアクション */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {fullMode ? (
              <span style={{
                fontSize: 14,
                color: t.nameText,
                letterSpacing: "0.1em",
                animation: "advancePulse 1.4s ease-in-out infinite",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.3s",
              }}>
                {advanceLabel}
              </span>
            ) : (
              actions
            )}
          </div>
        </div>

        {/* ── ポップアップ ── */}
        <SettingsPopup
          isOpen={openPopup === "settings"}
          onClose={() => setOpenPopup(null)}
          appearance={appearance}
          onChange={setDialogueAppearance}
        />
        <HintPopup
          isOpen={openPopup === "hint"}
          onClose={() => setOpenPopup(null)}
        />
        <RecipeBookPopup
          isOpen={openPopup === "recipe"}
          onClose={() => setOpenPopup(null)}
          onSelectRecipe={onRecipeSelect}
        />
      </>
    );
  }
);

export default DialogueBox;

function ToolBtn({
  label, onClick, bg, border, color,
}: {
  label: string; onClick: () => void; bg: string; border: string; color: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: "8px 18px",
        cursor: "pointer",
        fontSize: 14,
        color,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
