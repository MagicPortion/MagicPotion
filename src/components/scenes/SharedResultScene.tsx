import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { GOAL_MONEY, TOTAL_DAYS } from "../../data/constants";
import { parseResultParams } from "../../utils/share";

const formatGold = (amount: number) => `${amount.toLocaleString()}G`;

export default function SharedResultScene() {
  const { setScene } = useGameStore();
  const result = parseResultParams(window.location.search);

  const isClear = (result?.money ?? 0) >= GOAL_MONEY;

  const handleStart = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setScene("title");
  };

  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#120f18",
        color: "#f7ecd0",
        fontFamily: "monospace",
      })}
    >
      <div
        className={css({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "980px",
          maxWidth: "90%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(247,236,208,0.6)",
          background: "rgba(20,16,24,0.92)",
          boxShadow: "0 0 32px rgba(0,0,0,0.42)",
        })}
      >
        <header
          className={css({
            padding: "44px 48px 30px",
            borderBottom: "1px solid rgba(247,236,208,0.36)",
          })}
        >
          <h1
            className={css({
              margin: 0,
              fontSize: "56px",
              lineHeight: 1.3,
              letterSpacing: "0.1em",
              textAlign: "center",
              color: "#f5e7b5",
              textShadow: "0 0 14px rgba(245,231,181,0.26)",
            })}
          >
            経営結果
          </h1>
        </header>

        <div
          className={css({
            display: "grid",
            rowGap: "24px",
            padding: "44px 56px",
            fontSize: "34px",
            letterSpacing: "0.06em",
          })}
        >
          <div className={css({ display: "flex", justifyContent: "space-between" })}>
            <span>経営日数</span>
            <span>{TOTAL_DAYS}日間</span>
          </div>
          <div className={css({ display: "flex", justifyContent: "space-between" })}>
            <span>総収入</span>
            <span className={css({ color: "#b7f0bd" })}>+ {formatGold(result?.totalIncome ?? 0)}</span>
          </div>
          <div className={css({ display: "flex", justifyContent: "space-between" })}>
            <span>総支出</span>
            <span className={css({ color: "#ffb3aa" })}>- {formatGold(result?.totalExpense ?? 0)}</span>
          </div>
          <div
            className={css({
              display: "flex",
              justifyContent: "space-between",
              color: "#f5e7b5",
              fontWeight: "700",
              paddingTop: "16px",
              borderTop: "1px solid rgba(247,236,208,0.2)",
            })}
          >
            <span>所持金</span>
            <span>{formatGold(result?.money ?? 0)}</span>
          </div>
          <p
            className={css({
              margin: "8px 0 0",
              fontSize: "32px",
              textAlign: "center",
              color: isClear ? "#b7f0bd" : "#ffb3aa",
            })}
          >
            {isClear
              ? `借金${GOAL_MONEY.toLocaleString()}Gの返済に成功！`
              : "借金の返済に届かなかった…"}
          </p>
        </div>

        <footer
          className={css({
            padding: "28px 56px 44px",
            display: "flex",
            justifyContent: "center",
          })}
        >
          <button
            type="button"
            onClick={handleStart}
            className={css({
              minWidth: "320px",
              height: "76px",
              border: "1px solid rgba(245,231,181,0.72)",
              background: "rgba(0,0,0,0.72)",
              color: "#f5e7b5",
              cursor: "pointer",
              fontSize: "30px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textAlign: "center",
              transition: "all 0.16s ease",
              _hover: {
                background: "rgba(245,231,181,0.16)",
                transform: "translateY(-2px)",
              },
            })}
          >
            自分もお店を経営する
          </button>
        </footer>
      </div>
    </div>
  );
}
