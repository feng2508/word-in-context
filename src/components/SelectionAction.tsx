import { useState } from "react";
import ExplainButton from "./ExplainButton";
import Panel from "./Panel";
import {
  type SelectionData,
  useTextSelection,
} from "../hooks/useTextSelection";

type PanelData = Pick<SelectionData, "text" | "sentence">;

export default function SelectionAction() {
  const selection = useTextSelection();

  const [panelData, setPanelData] = useState<PanelData | null>(null);

  function openPanel() {
    if (!selection) {
      return;
    }

    setPanelData({
      text: selection.text,
      sentence: selection.sentence,
    });
  }

  function closePanel() {
    setPanelData(null);
  }

  return (
    <>
      {selection && (
        <ExplainButton
          position={selection.position}
          onClick={openPanel}
        />
      )}

      {panelData && (
        <Panel
          text={panelData.text}
          sentence={panelData.sentence}
          onClose={closePanel}
        />
      )}
    </>
  );
}