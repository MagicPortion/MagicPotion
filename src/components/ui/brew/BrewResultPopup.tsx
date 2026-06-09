import { useRef, useEffect } from "react";
import { css } from "#styled-system/css";
import type { BrewResult } from "./BrewPanel";
import NewBadge from "../common/NewBadge";

interface BrewResultPopupProps {
  results: BrewResult[];
  onClose: () => void;
}

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function BrewResultPopup({ results, onClose }: BrewResultPopupProps) {
  const potion   = results[0];
  const count    = results.length;
  const total    = results.reduce((s, r) => s + r.sellPrice, 0);
  const isNew    = results[0]?.isNew === true; // バッチ先頭のみが「初発見」フラグを持つ
  const mountTime = useRef(0);

  useEffect(() => {
    mountTime.current = Date.now();
  }, []);

  const handleClose = () => {
    if (mountTime.current === 0 || Date.now() - mountTime.current < 500) return;
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "absolute", inset: 0, zIndex: 60,
        // brewOverlayIn: オーバーレイフェードインのためinline style
        animation: "brewOverlayIn 0.18s ease forwards",
      }}
      className={css({
        bg: "rgba(2,1,10,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
      })}
    >
      <div
        // brewPopupIn: カード出現アニメーションのためinline style
        style={{ animation: "brewPopupIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        className={css({
          width: "920px",
          bg: "linear-gradient(180deg, #0e0a1e 0%, #0a0612 100%)",
          border: "1.5px solid #c8a84b",
          borderRadius: "24px",
          p: "56px 64px 52px",
          display: "flex", flexDirection: "column", alignItems: "center",
          boxShadow: "0 0 80px rgba(200,168,75,0.18), 0 32px 100px rgba(0,0,0,0.85)",
          position: "relative", overflow: "hidden",
        })}
      >
        {/* 装飾ライン（上） */}
        <div className={css({ display: "flex", alignItems: "center", gap: "12px", mb: "20px", width: "100%" })}>
          <div className={css({ flex: 1, height: "1px", bg: "linear-gradient(90deg, transparent, #c8a84b66)" })} />
          <span className={css({ fontSize: "28px", color: "#c8a84b", letterSpacing: "0.24em", whiteSpace: "nowrap" })}>
            POTION COMPLETE
          </span>
          <div className={css({ flex: 1, height: "1px", bg: "linear-gradient(270deg, transparent, #c8a84b66)" })} />
        </div>

        {/* 新しいレシピ発見バナー */}
        {isNew && (
          <div
            className={css({
              display: "flex", alignItems: "center", gap: "12px",
              bg: "linear-gradient(90deg, rgba(255,80,150,0.15), rgba(255,80,150,0.08))",
              border: "1px solid rgba(255,80,150,0.5)",
              borderRadius: "12px",
              px: "28px", py: "12px",
              mb: "20px", width: "100%",
              justifyContent: "center",
            })}
            // salePopupIn: バナー出現アニメーションのためinline style
            style={{ animation: "salePopupIn 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}
          >
            <span className={css({ fontSize: "30px", color: "rgba(255,80,150,1)", fontWeight: "900", letterSpacing: "0.06em" })}>
              新しいレシピを発見！
            </span>
          </div>
        )}

        {/* オーブ + スパークル */}
        <div className={css({ position: "relative", width: "280px", height: "280px", mb: "32px", flexShrink: 0, mx: "auto" })}>
          {/* スパークル: 放射方向・色・delayが動的のためinline style */}
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 1 }}>
            {ANGLES.map((angle, i) => (
              <div
                key={angle}
                style={{ position: "absolute", top: 0, left: 0, transform: `rotate(${angle}deg)`, transformOrigin: "0 0", width: 170, height: 0 }}
              >
                <span style={{
                  display: "block", position: "absolute", left: 30, top: -7,
                  width: count > 1 ? 16 : 12, height: count > 1 ? 16 : 12,
                  borderRadius: "50%",
                  backgroundColor: `#${potion.colorHex}`,
                  boxShadow: `0 0 16px #${potion.colorHex}`,
                  animation: `sparkleFly 0.72s cubic-bezier(0.2,0,0.4,1) ${i * 45}ms both`,
                }} />
              </div>
            ))}
          </div>

          {/* メインオーブ: colorHexが動的のためinline style */}
          <div
            style={{
              backgroundColor: `#${potion.colorHex}`,
              boxShadow: `0 0 60px #${potion.colorHex}bb, 0 0 130px #${potion.colorHex}44, inset 0 12px 36px rgba(255,255,255,0.22)`,
              animation: "orbPulseGlow 2s ease-in-out infinite",
            }}
            className={css({
              width: "280px", height: "280px", borderRadius: "full",
              position: "relative", zIndex: 2,
            })}
          />

          {/* NEW バッジ */}
          {isNew && (
            <div className={css({ position: "absolute", top: "-12px", left: "-12px", zIndex: 4 })}>
              <NewBadge />
            </div>
          )}

          {/* ×N バッジ */}
          {count > 1 && (
            <div
              // shelfBadgePop: バッジ出現アニメーションのためinline style
              style={{ animation: "shelfBadgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) 300ms both" }}
              className={css({
                position: "absolute", bottom: "-10px", right: "-10px", zIndex: 3,
                bg: "#8B6914", border: "2px solid #c8a84b",
                borderRadius: "24px", px: "18px", py: "6px",
                fontSize: "26px", fontWeight: "bold", color: "#1a0e06", whiteSpace: "nowrap",
              })}
            >
              ×{count}
            </div>
          )}
        </div>

        {/* ポーション名 */}
        <h2 className={css({ fontSize: "48px", fontWeight: "bold", color: "#f0e6c8", m: "0 0 16px", letterSpacing: "0.06em" })}>
          {potion.name}
        </h2>

        {/* レベルバッジ */}
        <div
          // shelfBadgePop: バッジ出現アニメーションのためinline style
          style={{ animation: "shelfBadgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 200ms both" }}
          className={css({
            display: "flex", alignItems: "center", gap: "10px",
            bg: "rgba(200,168,75,0.18)", border: "2px solid #c8a84b",
            borderRadius: "40px", px: "28px", py: "10px", mb: "24px",
          })}
        >
          <span className={css({ fontSize: "28px", color: "#c8a84b", letterSpacing: "0.06em" })}>LEVEL</span>
          <span className={css({ fontSize: "52px", fontWeight: "900", color: "#ffd700", lineHeight: 1, letterSpacing: "-0.02em" })}>
            {potion.level}
          </span>
        </div>

        {/* 価格情報 */}
        <div className={css({
          bg: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.22)",
          borderRadius: "14px", px: "44px", py: "20px",
          textAlign: "center", mb: "8px", minWidth: "300px",
        })}>
          {count > 1 ? (
            <>
              <p className={css({ fontSize: "28px", color: "#e8d8b8", m: "0 0 6px", fontWeight: "bold" })}>
                1本 {potion.sellPrice}G × {count}本
              </p>
              <p className={css({ fontSize: "32px", fontWeight: "bold", color: "#c8a84b", m: 0 })}>
                合計 {total}G
              </p>
            </>
          ) : (
            <p className={css({ fontSize: "32px", fontWeight: "bold", color: "#c8a84b", m: 0 })}>
              {potion.sellPrice}G
            </p>
          )}
        </div>

        {/* 装飾ライン（下） */}
        <div className={css({ width: "100%", height: "1px", bg: "linear-gradient(90deg, transparent, #c8a84b44, transparent)", my: "24px" })} />

        <p className={css({ fontSize: "26px", color: "#c8a84b", letterSpacing: "0.1em", m: 0, fontWeight: "bold" })}>
          タップして閉じる
        </p>
      </div>
    </div>
  );
}
