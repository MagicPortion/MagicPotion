import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";

const ENDING_LINES = [
  "あなたは5日間の魔法薬の調合を終え、\n遂に返済日を迎えることになった。",
  "1人の少女を助けたことから不思議な店へ招かれたあなた。",
  "その結末を、魔女と共に見届けることになる。",
] as const;

export default function EndingTransitionScene() {
  const { setScene } = useGameStore();

  const handleAdvance = () => {
    setScene("financial_report");
  };

  return (
    <div
      data-sound="select"
      onClick={handleAdvance}
      className={css({
        width: "100%",
        height: "100%",
        background: "#000000",
        color: "#ffffff",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <div
        className={css({
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            textAlign: "center",
            maxWidth: "1200px",
            width: "100%",
          })}
        >
          {ENDING_LINES.map((line, index) => (
            <p
              key={line}
              className={css({
                margin: 0,
                fontSize: "36px",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                textShadow: "0 0 12px rgba(255,255,255,0.2)",
                opacity: 0,
              })}
              style={{
                animation: `endingLinesFadeIn 1.4s ease-out forwards`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              {line}
            </p>
          ))}
          <p
            className={css({
              margin: 0,
              paddingTop: "20px",
              fontSize: "24px",
              opacity: 0.85,
              letterSpacing: "0.08em",
            })}
          >
            クリックで結果を見る
          </p>
        </div>
      </div>

      <div
        className={css({
          position: "absolute",
          right: "48px",
          bottom: "48px",
          fontSize: "54px",
          opacity: 0.85,
          animation: "advanceBounce 1.8s ease-in-out infinite",
        })}
      >
        ▶
      </div>
    </div>
  );
}
