type PanelProps = {
  text: string;
  sentence: string | null;
  onClose: () => void;
};

export default function Panel({ text, sentence, onClose }: PanelProps) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 360,
        height: "100vh",
        padding: 16,
        backgroundColor: "white",
        borderLeft: "1px solid #ddd",
        boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.15)",
        zIndex: 2147483647,
      }}
    >
      <button type="button" onClick={onClose} style={{ float: "right" }}>
        ×
      </button>

      <p>{text}</p>
      <p>{sentence}</p>
    </aside>
  );
}
