import { useCallback, useEffect, useRef, useState } from "react";
import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { playSelectSound } from "../../utils/sound";

const STORY_PANELS = [
  "都会の生活に疲れ、\nのどかな町へ引っ越してきたあなた。",
  "あなたは1人の少女を助けたことをきっかけに、\n魔法薬を扱う不思議な店へ招かれる。",
  "店を営むのは、少し頼りないけれど一生懸命な魔女。",
  "どうやら魔法薬作りの才能があったあなたは、\n魔女の店を手伝うことになった。",
  "店を手伝いながら平穏で暖かな日々を過ごしていたあなたたち。\nしかしある日、店に届いたのは一通の督促状。",
  "「 魔 女 銀 行  よ り  滞 納  の  お 知 ら せ 」",
  "あなたは期限までに滞納金を完済することができるのだろうか。"
] as const;

const FADE_OUT_DURATION = 1200;
const TYPING_DELAY = 90;

const typingCharClass = css({
  opacity: 0,
  transition: "opacity 0.08s linear",
});

export default function Introduction() {
  const { setScene } = useGameStore();
  const [page, setPage] = useState(0);
  const [showGoal, setShowGoal] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animatingRef = useRef(false);
  const textCompletedRef = useRef(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const timeoutRefs = useRef<number[]>([]);

  const setAnimatingState = (value: boolean) => {
    animatingRef.current = value;
  };

  const currentText = STORY_PANELS[page];
  const isLastPage = page === STORY_PANELS.length - 1;
  const isSkippingText = () => !textCompletedRef.current && (animatingRef.current || timeoutRefs.current.length > 0);

  const handleAdvance = useCallback(() => {
    if (isFadingOut) return;

    if (textCompletedRef.current) {
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
      return;
    }

    const isTyping = animatingRef.current || timeoutRefs.current.length > 0;
    if (isTyping) {
      timeoutRefs.current.forEach(window.clearTimeout);
      timeoutRefs.current = [];

      const el = textRef.current;
      if (el) {
        el.querySelectorAll("span").forEach((s) => ((s as HTMLElement).style.opacity = "1"));

        const processedCount = el.children.length;
        const chars = currentText.split("");

        for (let i = processedCount; i < chars.length; i++) {
          const char = chars[i];
          if (char === "\n") {
            el.appendChild(document.createElement("br"));
          } else {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.opacity = "1";
            el.appendChild(span);
          }
        }
      }

      textCompletedRef.current = true;
      setAnimatingState(false);
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
  }, [isFadingOut, showGoal, isLastPage, setScene, currentText]);

  const handleClick = () => {
    if (!isFadingOut && !isSkippingText()) {
      playSelectSound();
    }

    handleAdvance();
  };

  useEffect(() => {
    if (showGoal) return;

    const el = textRef.current;
    if (!el) return;

    timeoutRefs.current.forEach(window.clearTimeout);
    timeoutRefs.current = [];
    el.innerHTML = "";

    textCompletedRef.current = false;
    setAnimatingState(true);

    const chars = currentText.split("");
    let index = 0;

    const tick = () => {
      if (!el) return;
      if (index >= chars.length) {
        textCompletedRef.current = true;
        setAnimatingState(false);
        return;
      }

      const char = chars[index];
      index++;

      if (char === "\n") {
        el.appendChild(document.createElement("br"));
      } else {
        const span = document.createElement("span");
        span.textContent = char;
        span.className = typingCharClass;
        el.appendChild(span);
        requestAnimationFrame(() => {
          span.style.opacity = "1";
        });
      }

      if (index < chars.length) {
        timeoutRefs.current.push(window.setTimeout(tick, TYPING_DELAY));
      } else {
        timeoutRefs.current.push(
          window.setTimeout(() => {
            textCompletedRef.current = true;
            setAnimatingState(false);
          }, TYPING_DELAY)
        );
      }
    };

    tick();

    return () => {
      timeoutRefs.current.forEach(window.clearTimeout);
      timeoutRefs.current = [];
    };
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
  }, [handleAdvance]);

  return (
    <div
      data-sound="none"
      onClick={handleClick}
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
            <span
              className={css({
                display: "inline-block",
                width: "1ch",
                opacity: isFadingOut ? 0 : 0.9,
                color: "#ffffff",
              })}
            >
              ▍
            </span>
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
