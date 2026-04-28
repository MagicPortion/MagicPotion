import { css } from "../../../../styled-system/css";

interface ShopMessageProps {
  message: string;
}

export default function ShopMessage({ message }: ShopMessageProps) {
  return (
    <div
      style={{ position: "absolute", top: "52%", left: "50%", transform: "translateX(-50%)", zIndex: 10, whiteSpace: "nowrap" }}
      className={css({ fontSize: "15px", color: "#4a3f55", bg: "pastel.cream", px: "16px", py: "6px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" })}
    >
      {message}
    </div>
  );
}
