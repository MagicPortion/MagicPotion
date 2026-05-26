import { css } from "../../styled-system/css";

type HeaderProps = {
  bg: string;
  text: string;
  label: string;
  day: number;
  money: number;
};

export default function Header({
  bg,
  text,
  label,
  day,
  money,
}: HeaderProps) {
  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        px: "24px",
        py: "6px",

        bg,
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      })}
    >
      {/* 左側：ロゴ */}
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          margin: 0,
        }}
      >
      <img
        src="/MagicPotion/logo.png"
        alt="logo"
        style={{
          height: 90,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
      </h1>

      {/* 右側：ゲーム情報 */}
      <div
        style={{
          display: "flex",
          gap: 10,

          fontSize: 13,
          color: text,

          alignItems: "center",
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 16,
            padding: "3px 12px",
          }}
        >
          {day}日目
        </span>

        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 16,
            padding: "3px 12px",
          }}
        >
          {label}
        </span>

        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 16,
            padding: "3px 12px",
            fontWeight: "bold",
          }}
        >
          💰 {money}G
        </span>
      </div>
    </header>
  );
}