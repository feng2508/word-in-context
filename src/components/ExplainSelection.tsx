import ExplainButton from "./ExplainButton";
import { useSelectionData } from "../hooks/useSelectionData";

export default function ExplainSelection() {
  const { selection, clearSelection } = useSelectionData();

  async function openSidePanel() {
    if (!selection) {
      return;
    }

    const response = await browser.runtime.sendMessage({
      type: "open-side-panel",
      selection,
    });

    if (!response.ok) {
      console.error("Failed to open side panel:", response);
      return;
    }

    clearSelection();
  }

  if (!selection) { // If there's no selection, don't render anything.
    return null;
  }

  return (
    <ExplainButton position={selection.position} onClick={openSidePanel} />
  );
}
