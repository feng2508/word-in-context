type ExplainButtonProps = {
  position: {
    top: number;
    left: number;
  };
  onClick: () => void;
};

export default function ExplainButton({
  position,
  onClick,
}: ExplainButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 2147483647,
      }}
    >
      Explain
    </button>
  );
}