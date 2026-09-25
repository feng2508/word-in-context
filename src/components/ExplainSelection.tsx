import ExplainButton from "./ExplainButton";
import { useSelectionData } from "../hooks/useSelectionData";

export default function ExplainSelection() {
  const { selection, clearSelection } = useSelectionData();

  async function openSidePanel() {
    if (!selection) {
      return;
    }

    try {
      await browser.runtime.sendMessage({
        type: "open-side-panel",
      });

      clearSelection();
    } catch (error) {
      console.error("Failed to open side panel:", error);
    }
  }

  if (!selection) {
    return null;
  }

  return (
    <ExplainButton position={selection.position} onClick={openSidePanel} />
  );
}
