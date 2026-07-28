import { css } from "#styled-system/css";
import { formatDayLabel } from "../../../data/constants";

interface BlackoutDayProps {
  day: number;
}

export default function BlackoutDay({ day }: BlackoutDayProps) {
  return (
    <div
      className={css({
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#000",
      })}
      // blackoutIn: 暗転フェードイン用アニメーションのためinline style
      style={{ animation: "blackoutIn 0.6s ease forwards" }}
    >
      <span
        className={css({
          color: "white", fontWeight: 900, letterSpacing: "0.12em", fontSize: "80px",
        })}
        // dayTextShow: 日付テキスト表示アニメーションのためinline style
        style={{ animation: "dayTextShow 2.5s ease 0.4s both" }}
      >
        {formatDayLabel(day)}
      </span>
    </div>
  );
}
