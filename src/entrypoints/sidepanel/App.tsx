// src/entrypoints/sidepanel/App.tsx
import { useEffect, useState } from "react";
import type { Browser } from "@wxt-dev/browser";
import type { SelectionData } from "../../hooks/useSelectionData";

export default function App() {
  const [selection, setSelection] = useState<SelectionData | null>(null);

  useEffect(() => {
    function setCurrentSelection(currentSelection: unknown) {
      setSelection((currentSelection as SelectionData | null) ?? null);
    }

    browser.storage.session
      .get("currentSelection")
      .then(({ currentSelection }) => setCurrentSelection(currentSelection));

    function handleStorageChange(
      changes: Record<string, Browser.storage.StorageChange>,
      areaName: Browser.storage.AreaName,
    ) {
      if (areaName === "session" && changes.currentSelection) {
        setCurrentSelection(changes.currentSelection.newValue);
      }
    }

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (!selection) return <p>Select a word first.</p>;

  return (
    <main>
      <h2>Selected word</h2>
      <p>{selection.text}</p>
      <h2>Sentence</h2>
      <p>{selection.sentence ?? "No sentence found."}</p>
    </main>
  );
}
