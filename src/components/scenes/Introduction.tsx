import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";

const STORY_PANELS = [
  "都会の生活に疲れ、\nのどかな町へ引っ越してきたあなた。",
  "あなたは1人の少女を助けたことをきっかけに、\n魔法薬を扱う不思議な店へ招かれる。",
  "店を営むのは、少し頼りないけれど一生懸命な魔女。",
  "どうやら魔法薬作りの才能があったあなたは、\n魔女の店を手伝うことになった。",
  "店を手伝いながら平穏で暖かな日々を過ごしていたあなたたち。\nしかしある日、店に届いたのは一通の督促状。",
  "「 魔  女  銀  行  よ  り  滞  納  の  お  知  ら  せ 」",
  "あなたは期限までに返済金を完遂することができるのだろうか。"
] as const;

const FADE_OUT_DURATION = 1200;
const TYPING_DELAY = 54;

export default function Introduction() {
  const { setScene } = useGameStore();
  const [page, setPage] = useState(0);
  const [showGoal, setShowGoal] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animating, setAnimating] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const currentText = STORY_PANELS[page];
  const isLastPage = page === STORY_PANELS.length - 1;

  useEffect(() => {
    if (showGoal) return;

    const el = textRef.current;
    if (!el) return;

    animRef.current?.pause();
    el.innerHTML = "";

    currentText.split("").forEach((char) => {
      if (char === "\n") {
        el.appendChild(document.createElement("br"));
        return;
      }

      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      el.appendChild(span);
    });

    setAnimating(true);
    animRef.current = animate(el.querySelectorAll("span"), {
      opacity: [0, 1],
      delay: stagger(TYPING_DELAY),
      duration: 1,
      ease: "linear",
      onComplete: () => setAnimating(false),
    });
  }, [currentText, showGoal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
        event.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [animating, isFadingOut, page, showGoal]);

  const handleAdvance = () => {
    if (isFadingOut) return;

    if (animating) {
      animRef.current?.pause();
      textRef.current?.querySelectorAll("span").forEach((s) => ((s as HTMLElement).style.opacity = "1"));
      setAnimating(false);
      return;
    }

    if (showGoal) {
      setIsFadingOut(true);
      window.setTimeout(() => setScene("conversation"), FADE_OUT_DURATION);
      return;
    }

    if (!isLastPage) {
      setPage((prev) => prev + 1);
      return;
    }

    setShowGoal(true);
  };

  return (
    <div
      onClick={handleAdvance}
      className={css({
        width: "100%",
        height: "100%",
        background: "#000000",
        color: "#ffffff",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: isFadingOut ? 0 : 1,
        transition: `opacity ${FADE_OUT_DURATION}ms ease-out`,
      })}
    >
      {!showGoal ? (
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
          <p
            className={css({
              fontSize: "36px",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              textAlign: "center",
              maxWidth: "1200px",
              margin: 0,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              textShadow: "0 0 12px rgba(255,255,255,0.2)",
              userSelect: "none",
            })}
          >
            <span ref={textRef} />
            {!animating && !isFadingOut ? <span className={css({ opacity: 0.8 })}>▍</span> : null}
          </p>
        </div>
      ) : (
        <div
          className={css({
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          })}
        >
          <div
            className={css({
              width: "900px",
              border: "2px solid rgba(255, 227, 125, 0.83)",
              borderRadius: "28px",
              background: "rgba(217, 0, 255, 0.16)",
              padding: "46px 50px",
              boxShadow: "0 0 0 4px rgba(255, 0, 195, 0.11)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            })}
          >
            <div
              className={css({
                fontSize: "44px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
                textAlign: "center",
                lineHeight: 1.3,
                paddingBottom: "6px",
              })}
            >
              ゲームの目標
              <div className={css({ fontSize: "36px", marginTop: "8px", color: "#fff4a3" })}>
                【目指せ★滞納金完済！】
              </div>
            </div>
            <div
              className={css({
                display: "grid",
                gap: "14px",
                fontSize: "28px",
                lineHeight: 1.7,
                padding: "6px 8px",
              })}
            >
              <p>長年の経営不振により、</p>
              <p>督促状「魔女年金滞納のお知らせ」が届いてしまった！？</p>
              <p
                className={css({
                  fontSize: "34px",
                  fontWeight: "bold",
                  color: "#ffe66d",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  textShadow: "0 0 16px rgba(255,230,109,0.35)",
                })}
              >
                期限は 5 日後、目標金額 100000 G。
              </p>
              <p>魔女の店と彼女の運命は主人公に託された！！！</p>
            </div>
            <p
              className={css({
                fontSize: "24px",
                opacity: 0.85,
                textAlign: "right",
                margin: 0,
                paddingTop: "4px",
              })}
            >
              クリックでゲームを始めます
            </p>
          </div>
        </div>
      )}

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
