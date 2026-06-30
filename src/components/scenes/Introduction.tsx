import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";

const STORY_PANELS = [
  "夜の森の奥で、ひとつの願いが揺れていた。\n誰にも知られぬ、失われたレシピの欠片を探すために。",
  "古びた店先に、黒い袴を着た旅人が現れた。\n彼は、ふしぎな薬を求めて、娘の手を借りた。",
  "娘は素材を選び、火を起こし、ひと滴ずつ調合していく。\n失敗しても、また試す気持ちだけは消えなかった。",
  "やがて店の灯りは揺れ、新しい月が昇る。\n今日の冒険は、まだ始まったばかりだ。",
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
              width: "840px",
              border: "2px solid rgba(255,255,255,0.9)",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.06)",
              padding: "48px 44px",
              boxShadow: "0 0 0 3px rgba(255,255,255,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            })}
          >
            <div
              className={css({
                fontSize: "42px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
                textAlign: "center",
              })}
            >
              ゲームの目標
            </div>
            <div
              className={css({
                display: "grid",
                gap: "20px",
                fontSize: "30px",
                lineHeight: 1.7,
              })}
            >
              <p>・依頼を受けて、ポーションを調合する</p>
              <p>・失われたレシピを集めて、店の伝説を紡ぐ</p>
              <p>・調合の腕を上げて、街一番の薬師を目指す</p>
            </div>
            <p
              className={css({
                fontSize: "26px",
                opacity: 0.8,
                textAlign: "right",
                margin: 0,
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
