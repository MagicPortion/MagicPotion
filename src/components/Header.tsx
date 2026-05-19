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
        px: "20px",
        py: "10px",
        bg,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      })}
    >
      {/* 左側：ロゴ＋タイトル画像 */}
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: 0,
        }}
      >
        <img
          src="/MagicPotion/logo.png"
          alt="logo"
          style={{
            width: 220,
            height: 120,
            objectFit: "contain",
          }}
        />
      </h1>

      {/* 右側：ゲーム情報 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          fontSize: 14,
          color: text,
          alignItems: "center",
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 20,
            padding: "4px 14px",
          }}
        >
          {day}日目
        </span>

        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 20,
            padding: "4px 14px",
          }}
        >
          {label}
        </span>

        <span
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: 20,
            padding: "4px 14px",
            fontWeight: "bold",
          }}
        >
          💰 {money}G
        </span>
      </div>
    </header>
  );
}