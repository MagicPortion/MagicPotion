import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { useGameStore } from "../../../store/useGameStore";
import SpeechBox, { type SpeechBoxHandle, type Choice } from "./SpeechBox";
import SceneToolbar from "./SceneToolbar";
import SettingsPopup from "../../popups/SettingsPopup";
import HintPopup from "../../popups/HintPopup";
import RecipeBookPopup from "../../popups/RecipeBookPopup";
import { css } from "@styled-system/css";

export type { Choice };

export interface DialogueBoxHandle {
  click: () => void;
}

interface DialogueBoxProps {
  /** 指定するとセリフボックスを表示（会話モード） */
  speakerName?: string;
  text?: string;
  onAdvance?: () => void;
  choices?: Choice[];
  onInventory?: () => void;
  /** ツールバーモード時の右側ボタン群 */
  actions?: ReactNode;
  /** BrewScene 用レシピクイックセット */
  onRecipeSelect?: (baseId: string, accentId: string) => void;
}

// ── シーン用アクションボタン ────────────────────────────────────────────
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
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "6px",
        bg: variant === "primary" ? "#8B6914" : "rgba(14,8,2,0.92)",
        border: variant === "primary" ? "1px solid #c8a84b" : "1px solid #5a4418",
        borderRadius: "6px",
        px: "26px",
        py: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "15px",
        fontWeight: variant === "primary" ? "bold" : "normal",
        color: variant === "primary" ? "#1a0e06" : "#c8a84b",
        letterSpacing: "0.06em",
        opacity: disabled ? 0.4 : 1,
        whiteSpace: "nowrap",
      })}
    >
      {children}
    </button>
  );
}

// ── メインコンポーネント ─────────────────────────────────────────────────
const DialogueBox = forwardRef<DialogueBoxHandle, DialogueBoxProps>(
  function DialogueBox(
    { speakerName, text, onAdvance, choices, actions, onRecipeSelect, onInventory },
    ref
  ) {
    const { dialogueAppearance, setDialogueAppearance } = useGameStore();
    const speechRef = useRef<SpeechBoxHandle>(null);
    const [openPopup, setOpenPopup] = useState<"settings" | "hint" | "recipe" | null>(null);

    useImperativeHandle(ref, () => ({
      click: () => {
        if (openPopup !== null) return;
        speechRef.current?.click();
      },
    }));

    return (
      <>
        {!!text && (
          <SpeechBox
            ref={speechRef}
            speakerName={speakerName!}
            text={text}
            onAdvance={onAdvance!}
            choices={choices}
          />
        )}

        <SceneToolbar
          onSettings={() => setOpenPopup("settings")}
          onHint={() => setOpenPopup("hint")}
          onInventory={onInventory}
          onRecipe={() => setOpenPopup("recipe")}
          actions={text ? undefined : actions}
        />

        <SettingsPopup
          isOpen={openPopup === "settings"}
          onClose={() => setOpenPopup(null)}
          appearance={dialogueAppearance}
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
