import { css } from "#styled-system/css";
import { IconCoin } from "./ui/icons";

type HeaderProps = {
  bg: string;
  text: string;
  label: string;
  day: number;
  money: number;
};

export default function Header({ bg, text, label, day, money }: HeaderProps) {
  return (
    <header
      // bg はシーンごとに異なる動的テーマ色のためinline style
      style={{ background: bg }}
      className={css({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "24px",
        py: "6px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      })}
    >
      <h1 className={css({ display: "flex", alignItems: "center", m: 0 })}>
        <img
          src="/MagicPotion/title.png"
          alt="title"
          className={css({ h: "90px", w: "auto", objectFit: "contain", display: "block" })}
        />
      </h1>

      {/* color: text はシーンごとに異なる動的テーマ色のためinline style */}
      <div
        style={{ color: text }}
        className={css({ display: "flex", gap: "10px", fontSize: "24px", alignItems: "center" })}
      >
        <span className={css({ bg: "rgba(255,255,255,0.45)", borderRadius: "6px", px: "12px", py: "3px" })}>
          {day}日目
        </span>
        <span className={css({ bg: "rgba(255,255,255,0.45)", borderRadius: "16px", px: "12px", py: "3px" })}>
          {label}
        </span>
        <span className={css({ display: "flex", alignItems: "center", gap: "6px", bg: "rgba(255,255,255,0.45)", borderRadius: "16px", px: "12px", py: "3px", fontWeight: "bold" })}>
          <IconCoin size={20} /> {money}G
        </span>
      </div>
    </header>
  );
}
