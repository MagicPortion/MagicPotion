import { css } from "#styled-system/css";
import { IconCoin, IconMorning, IconAfternoon, IconNight } from "./ui/icons";
import titleImage from "../assets/images/title.png";

type HeaderProps = {
  label: string;
  day: number;
  money: number;
};

export default function Header({ label, day, money }: HeaderProps) {
  const TimeIcon = label === "朝" ? IconMorning : label === "昼" ? IconAfternoon : IconNight;

  return (
    <header
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
        bg: "#2c2c2c",
        color: "white",
        gap: "16px",
      })}
    >
      <h1 className={css({ display: "flex", alignItems: "center", m: 0, minW: "0" })}>
        <img
          src={titleImage}
          alt="title"
          className={css({ h: "70px", w: "auto", objectFit: "contain", display: "block" })}
        />
      </h1>

      <div
        className={css({ display: "flex", gap: "16px", alignItems: "center", color: "white", flex: 1, justifyContent: "flex-end" })}
      >
        <div className={css({ display: "flex", alignItems: "center", gap: "8px", bg: "rgba(255,255,255,0.15)", borderRadius: "6px", px: "16px", py: "4px" })}>
          <span className={css({ fontSize: "28px", fontWeight: "bold" })}>{day}日目</span>
        </div>
        <div className={css({ display: "flex", alignItems: "center", gap: "8px", bg: "rgba(255,255,255,0.15)", borderRadius: "6px", px: "14px", py: "4px" })}>
          <TimeIcon size={24} />
        </div>
        <div className={css({ display: "flex", alignItems: "center", gap: "8px", bg: "rgba(255,255,255,0.15)", borderRadius: "6px", px: "16px", py: "4px", fontWeight: "bold" })}>
          <IconCoin size={24} />
          <span className={css({ fontSize: "28px" })}>{money}G</span>
        </div>
      </div>
    </header>
  );
}
