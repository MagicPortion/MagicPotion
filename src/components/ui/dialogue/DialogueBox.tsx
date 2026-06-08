import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { useGameStore } from "../../../store/useGameStore";
import SpeechBox, { type SpeechBoxHandle, type Choice } from "./SpeechBox";
import SceneToolbar from "./SceneToolbar";
import SettingsPopup from "../../popups/SettingsPopup";
import HintPopup from "../../popups/HintPopup";
import RecipeBookPopup from "../../popups/RecipeBookPopup";
export type { Choice };
export { ActionButton } from "../common/ActionButton";

export interface DialogueBoxHandle {
  click: () => void;
}

interface DialogueBoxProps {
  speakerName?: string;
  text?: string;
  onAdvance?: () => void;
  choices?: Choice[];
  onInventory?: () => void;
  actions?: ReactNode;
  onRecipeSelect?: (baseId: string, accentId: string) => void;
}

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
