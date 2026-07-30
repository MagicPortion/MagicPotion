import { css } from "#styled-system/css";
import React from "react";
import { CLEAR_MONEY_THRESHOLD, useGameStore } from "../../store/useGameStore";
import ed2Image from "#assets/images/ED2.png";
import ed1Image from "#assets/images/ED1.png";

export default function GameEndScene() {
  const { money, setScene } = useGameStore();
  const isClear = money >= CLEAR_MONEY_THRESHOLD;
  const endingNumber = isClear ? "END 01 : 返済完了 ~賑わいの店~" : "END 02 : 返済失敗 ~空き地~";
  const endingText = isClear
    ? "あれから無事に返済を完了した魔女とあなたは、\n今日も不思議な店を営んでいる。\nお店は賑わい、魔法薬の調合も順調だ。\nこれからもあなたは魔女と共にこの町で歩んでいくのだろう。"
    // 失敗END2 の文章
    : "返済期日に間に合わなかった魔女の店は、\n更地となり売りに出されてしまった。\n空き地を見つめる魔女はこれからどうやって生きていくのか、\nあなたは心配でならなかった。";

  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#000000",
        color: "#ffffff",
      })}
    >
      <div
        className={css({
          position: "absolute",
          top: "96px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "980px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "44px",
        })}
      >
        <div
          className={css({
            width: "840px",
            height: "472px",
            border: "1px solid rgba(255,255,255,0.55)",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          })}
        >
          {isClear ? (
            <img
              src={ed1Image}
              alt="返済完了後の賑わいの店"
              className={css({
                width: "100%",
                height: "100%",
                objectFit: "cover",
              })}
            />
          ) : (
            <img
              src={ed2Image}
              alt="返済失敗後の空き地"
              className={css({
                width: "100%",
                height: "100%",
                objectFit: "cover",
              })}
            />
          )}
        </div>

        <div
          className={css({
            width: "1200px",
            minHeight: "188px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 48px",
          })}
        >
          <p
            className={css({
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.85,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              textShadow: "0 0 12px rgba(255,255,255,0.18)",
            })}
          >
            {endingText}
          </p>
        </div>
      </div>

      <div
        className={css({
          position: "absolute",
          left: "72px",
          bottom: "56px",
          fontSize: "34px",
          fontWeight: "700",
          letterSpacing: "0.18em",
          color: "#f5e7b5",
          textShadow: "0 0 12px rgba(245,231,181,0.35)",
        })}
      >
        {endingNumber}
      </div>

      {showButton && (
      <button
        type="button"
        onClick={() => setScene("title")}
        className={css({
          position: "absolute",
          right: "72px",
          bottom: "48px",
          minWidth: "260px",
          height: "72px",
          border: "1px solid rgba(245,231,181,0.72)",
          background: "rgba(0,0,0,0.72)",
          color: "#f5e7b5",
          cursor: "pointer",
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "0.1em",
          textAlign: "center",
          transition: "all 0.16s ease",
          _hover: {
            background: "rgba(245,231,181,0.16)",
            transform: "translateY(-2px)",
          },
        })}
        style={{ opacity: 0, animation: "fadeInButton 0.5s ease-out forwards" }}
      >
        ホームへ戻る
      </button>
    )}
    </div>
  );
}
