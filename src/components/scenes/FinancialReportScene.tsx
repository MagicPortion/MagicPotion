import { css } from "#styled-system/css";
import { CLEAR_MONEY_THRESHOLD, END_DAY, useGameStore } from "../../store/useGameStore";

const formatGold = (amount: number) => `${amount.toLocaleString()}G`;

export default function FinancialReportScene() {
  const { dailyFinanceReports, money, setScene } = useGameStore();
  const reportByDay = new Map(dailyFinanceReports.map((report) => [report.day, report]));
  const reports = Array.from({ length: END_DAY }, (_, index) => {
    const day = index + 1;
    return reportByDay.get(day) ?? { day, expense: 0, income: 0 };
  });

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
          top: "72px",
          bottom: "132px",
          left: "50%",
          width: "50%",
          maxWidth: "980px",
          minWidth: "880px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(247,236,208,0.6)",
          background: "rgba(20,16,24,0.92)",
          boxShadow: "0 0 32px rgba(0,0,0,0.42)",
        })}
      >
        <header
          className={css({
            flexShrink: 0,
            padding: "44px 48px 30px",
            borderBottom: "1px solid rgba(247,236,208,0.36)",
          })}
        >
          <h1
            className={css({
              margin: 0,
              fontSize: "64px",
              lineHeight: 1,
              letterSpacing: "0.12em",
              textAlign: "center",
              color: "#f5e7b5",
              textShadow: "0 0 14px rgba(245,231,181,0.26)",
            })}
          >
            終始報告書
          </h1>
        </header>

        <div
          className={css({
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: "24px",
            padding: "30px 56px 20px",
            fontSize: "34px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            color: "#dac481",
            borderBottom: "1px solid rgba(247,236,208,0.2)",
          })}
        >
          <span>日数</span>
          <span className={css({ textAlign: "right" })}>支出</span>
          <span className={css({ textAlign: "right" })}>収入</span>
        </div>

        <div
          className={css({
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "6px 56px",
            scrollbarColor: "#dac481 rgba(255,255,255,0.08)",
          })}
        >
          {reports.map((report) => (
            <div
              key={report.day}
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                columnGap: "24px",
                alignItems: "center",
                minHeight: "76px",
                borderBottom: "1px solid rgba(247,236,208,0.12)",
                fontSize: "34px",
                letterSpacing: "0.06em",
              })}
            >
              <span>{report.day}日目</span>
              <span className={css({ textAlign: "right", color: "#ffb3aa" })}>
                - {formatGold(report.expense)}
              </span>
              <span className={css({ textAlign: "right", color: "#b7f0bd" })}>
                + {formatGold(report.income)}
              </span>
            </div>
          ))}
        </div>

        <footer
          className={css({
            flexShrink: 0,
            padding: "28px 56px 40px",
            borderTop: "1px solid rgba(247,236,208,0.36)",
            display: "grid",
            rowGap: "20px",
            fontSize: "38px",
            letterSpacing: "0.08em",
          })}
        >
          <div className={css({ display: "flex", justifyContent: "space-between" })}>
            <span>返済額</span>
            <span>{formatGold(CLEAR_MONEY_THRESHOLD)}</span>
          </div>
          <div className={css({ display: "flex", justifyContent: "space-between", color: "#f5e7b5", fontWeight: "700" })}>
            <span>所持金</span>
            <span>{formatGold(money)}</span>
          </div>
        </footer>
      </div>

      <button
        type="button"
        onClick={() => setScene("game_end")}
        className={css({
          position: "absolute",
          right: "72px",
          bottom: "48px",
          minWidth: "220px",
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
      >
        エンドへ
      </button>
    </div>
  );
}
