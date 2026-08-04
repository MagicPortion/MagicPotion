import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";

// names に氏名を追加すると、同じ役割の右側へ縦に並んで表示されます。
const DEVELOPER_CREDITS = [
  { role: "原作", names: ["ぽん"] },
  { role: "イラスト", names: ["ぽん","ｽﾞｯﾁｰ","さく"] },
  { role: "コード開発", names: ["ようかん","トマト","かえで","じゃがいも","冬の桜桃","さく"] },
  { role: "プロダクト管理", names: ["冬の桜桃","ぽん"] },
  { role: "ゲームデザイン", names: ["ぽん","冬の桜桃","かえで"] },
  { role: "テスト協力", names: ["ブルーシート", "k","ぴ","たま","つたや","k10","ななななな","ぽ","かな"] },
];

// bgmNames に追加したBGM名は、同じ提供サイトの右側へ縦に並びます。
const BGM_CREDITS = [
  {
    site: "PeriTuneオリジナル音楽",
    bgmNames: ["【無料フリーBGM】ミステリアスなダークメルヘンBGM「Bewitched_Forest」"],
  },
];

// seNames に追加したSE名は、同じ提供サイトの右側へ縦に並びます。
const SOUND_EFFECT_CREDITS = [
  {
    site: "効果音ラボ",
    seNames: ["決定ボタンを押す32","決定ボタンを押す46", "キャンセル8","煙モクモク","うごめく触手","メッセージ表示音1"],
  },
  {
    site: "OtoLogic",
    seNames: ["Motion-Swish05-1"],
  },
];

export default function CreditsScene() {
  const setScene = useGameStore((state) => state.setScene);

  return (
    <main
      className={css({
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 42%, #201707 0%, #090704 46%, #000 82%)",
        color: "#29190b",
      })}
    >
      <div
        aria-hidden="true"
        className={css({
          position: "absolute",
          inset: "28px",
          border: "1px solid rgba(200, 168, 75, 0.32)",
          boxShadow: "inset 0 0 36px rgba(139, 105, 20, 0.09)",
          pointerEvents: "none",
        })}
      />

      <section
        aria-labelledby="credits-title"
        className={css({
          width: "610px",
          height: "840px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: "74px",
          py: "60px",
          border: "5px double #79500f",
          background: "linear-gradient(100deg, #c7a35d 0%, #ead39a 7%, #f2dfad 48%, #e4c887 92%, #b68b42 100%)",
          boxShadow: "0 18px 55px rgba(0,0,0,0.85), inset 0 0 45px rgba(82,43,4,0.28)",
          _before: {
            content: "''",
            position: "absolute",
            inset: "16px",
            border: "1px solid rgba(99, 57, 10, 0.5)",
            pointerEvents: "none",
          },
        })}
      >
        <div className={css({ color: "#8b6914", fontSize: "15px", letterSpacing: "0.45em", mb: "8px" })}>
          ◆ ◆ ◆
        </div>
        <h1
          id="credits-title"
          className={css({
            m: 0,
            color: "#2a1608",
            fontFamily: "serif",
            fontSize: "30px",
            letterSpacing: "0.2em",
            textShadow: "0 1px rgba(255,255,255,0.5)",
          })}
        >
          クレジット
        </h1>
        <div className={css({ width: "100%", height: "2px", my: "5px", background: "linear-gradient(90deg, transparent, #76500f 18%, #76500f 82%, transparent)" })} />

        <div
          className={`credits-scroll ${css({
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            pr: "10px",
            textAlign: "center",
            overscrollBehavior: "contain",
          })}`}
        >
          <div>
            <h2 className={css({ m: 0, mb: "15px", color: "#76500f", fontSize: "25px", letterSpacing: "0.18em" })}>
              開発者
            </h2>
            <div className={css({ width: "100%", display: "flex", flexDirection: "column", gap: "18px" })}>
              {DEVELOPER_CREDITS.map((credit) => (
                <div
                  key={credit.role}
                  className={css({
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "72px",
                    alignItems: "start",
                    fontSize: "19px",
                    lineHeight: 1.45,
                    letterSpacing: "0.05em",
                  })}
                >
                  <div className={css({ color: "#76500f", textAlign: "right", whiteSpace: "nowrap" })}>
                    {credit.role}
                  </div>
                  <div className={css({ color: "#2f1b0d", textAlign: "left" })}>
                    {credit.names.map((name, index) => (
                      <div key={`${name}-${index}`}>{name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={css({ m: 0, mb: "10px", color: "#76500f", fontSize: "25px", letterSpacing: "0.18em" })}>
              使用BGM
            </h2>
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "72px",
                mb: "12px",
                color: "#76500f",
                fontSize: "16px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
              })}
            >
              <div className={css({ textAlign: "right" })}>サイト</div>
              <div className={css({ textAlign: "left" })}>BGM名</div>
            </div>
            <div className={css({ display: "flex", flexDirection: "column", gap: "18px" })}>
              {BGM_CREDITS.map((credit, creditIndex) => (
                <div
                  key={`${credit.site}-${creditIndex}`}
                  className={css({
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "72px",
                    alignItems: "start",
                    fontSize: "19px",
                    lineHeight: 1.5,
                    letterSpacing: "0.05em",
                  })}
                >
                  <div className={css({ color: "#76500f", textAlign: "right" })}>{credit.site}</div>
                  <div className={css({ color: "#2f1b0d", textAlign: "left" })}>
                    {credit.bgmNames.map((bgmName, bgmIndex) => (
                      <div key={`${bgmName}-${bgmIndex}`}>{bgmName}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={css({ m: 0, mb: "10px", color: "#76500f", fontSize: "25px", letterSpacing: "0.18em" })}>
              使用SE
            </h2>
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "72px",
                mb: "12px",
                color: "#76500f",
                fontSize: "16px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
              })}
            >
              <div className={css({ textAlign: "right" })}>サイト</div>
              <div className={css({ textAlign: "left" })}>SE名</div>
            </div>
            <div className={css({ display: "flex", flexDirection: "column", gap: "18px" })}>
              {SOUND_EFFECT_CREDITS.map((credit, creditIndex) => (
                <div
                  key={`${credit.site}-${creditIndex}`}
                  className={css({
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "72px",
                    alignItems: "start",
                    fontSize: "19px",
                    lineHeight: 1.5,
                    letterSpacing: "0.05em",
                  })}
                >
                  <div className={css({ color: "#76500f", textAlign: "right" })}>{credit.site}</div>
                  <div className={css({ color: "#2f1b0d", textAlign: "left" })}>
                    {credit.seNames.map((seName, seIndex) => (
                      <div key={`${seName}-${seIndex}`}>{seName}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={css({ mt: "auto", color: "#76500f", fontSize: "18px", letterSpacing: "0.25em" })}>
          MAGIC POTION
        </div>
      </section>

      <button
        type="button"
        data-sound="cancel"
        onClick={() => setScene("title")}
        className={css({
          position: "absolute",
          right: "52px",
          bottom: "42px",
          minWidth: "190px",
          px: "26px",
          py: "12px",
          border: "2px solid #8b6914",
          borderRadius: "8px",
          background: "rgba(8, 5, 2, 0.9)",
          color: "#e0c56f",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          transition: "all 0.15s ease",
          _hover: { color: "#fff1b8", borderColor: "#c8a84b", transform: "translateY(-2px)" },
        })}
      >
        タイトルへ戻る
      </button>
    </main>
  );
}
