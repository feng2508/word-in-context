type ExplainButtonProps = {
  position: {
    top: number;
    left: number;
  };
  onClick: () => void;
};

const buttonStyles = `
  .explain-button {
    border: 0;
    border-radius: 999px;
    padding: 9px 14px;
    color: #ffffff;
    background: #7b61b5;
    box-shadow: 0 3px 10px rgb(31 26 35 / 22%);
    font: 700 0.875rem/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
    cursor: pointer;
    transition: background-color 150ms ease, box-shadow 150ms ease,
      transform 150ms ease;
  }

  .explain-button:hover {
    background: #6750a4;
    box-shadow: 0 5px 14px rgb(31 26 35 / 28%);
    transform: translateY(-1px);
  }

  .explain-button:focus-visible {
    outline: 3px solid #d8cde9;
    outline-offset: 3px;
  }
`;

export default function ExplainButton({
  position,
  onClick,
}: ExplainButtonProps) {
  return (
    <>
      <style>{buttonStyles}</style>
      <button
        className="explain-button"
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
    </>
  );
}
