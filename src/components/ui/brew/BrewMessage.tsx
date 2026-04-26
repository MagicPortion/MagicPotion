import { css } from "../../../../styled-system/css";

interface BrewMessageProps {
  message: string;
}

export default function BrewMessage({ message }: BrewMessageProps) {
  return (
    <div
      style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
      className={css({ bg: "pastel.lavender", px: "20px", py: "8px", borderRadius: "20px", boxShadow: "0 3px 12px rgba(0,0,0,0.25)", fontSize: "15px", color: "#4a3f55", whiteSpace: "nowrap" })}
    >
      {message}
    </div>
  );
}
