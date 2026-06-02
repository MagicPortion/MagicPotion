import { useRef, useEffect } from "react";
import { css } from "#styled-system/css";
import type { BrewResult } from "./BrewPanel";

interface BrewResultPopupProps {
  results: BrewResult[];
  onClose: () => void;
}

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function BrewResultPopup({ results, onClose }: BrewResultPopupProps) {
  const potion = results[0];
  const count  = results.length;
  const total  = results.reduce((s, r) => s + r.sellPrice, 0);
  const mountTime = useRef(0);

  useEffect(() => {
    mountTime.current = Date.now();
  }, []);

  const handleClose = () => {
    // 誤クリック・スキップクリックの連打による即時クローズを防ぐため、マウント後500ms以内は閉じる処理を無視する
    if (mountTime.current === 0 || Date.now() - mountTime.current < 500) return;
    onClose();
  };

  return (
    // カード内も含めてどこをタップしても閉じる。zIndex: 60でSceneToolbar(50)より上に出す
    <div
      onClick={handleClose}
      style={{
        position: "absolute", inset: 0, zIndex: 60,
        animation: "brewOverlayIn 0.18s ease forwards",
      }}
      className={css({
        bg: "rgba(2,1,10,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div
        style={{
          animation: "brewPopupIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
        className={css({
          width: "920px",
          bg: "linear-gradient(180deg, #0e0a1e 0%, #0a0612 100%)",
          border: "1.5px solid #c8a84b",
          borderRadius: "24px",
          p: "56px 64px 52px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 0 80px rgba(200,168,75,0.18), 0 32px 100px rgba(0,0,0,0.85)",
          position: "relative",
          overflow: "hidden",
        })}
      >
        {/* 装飾ライン（上） */}
        <div className={css({ display: "flex", alignItems: "center", gap: "12px", mb: "28px", width: "100%" })}>
          <div className={css({ flex: 1, height: "1px", bg: "linear-gradient(90deg, transparent, #c8a84b66)" })} />
          <span className={css({ fontSize: "28px", color: "#c8a84b", letterSpacing: "0.24em", whiteSpace: "nowrap" })}>
            POTION COMPLETE
          </span>
          <div className={css({ flex: 1, height: "1px", bg: "linear-gradient(270deg, transparent, #c8a84b66)" })} />
        </div>

        {/* オーブ + スパークル */}
        <div className={css({ position: "relative", width: "280px", height: "280px", mb: "32px", flexShrink: 0, mx: "auto" })}>
          {/* スパークル。各spawnをcssに分離できないのでsparkle位置・回転だけinline style */}
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 1 }}>
            {ANGLES.map((angle, i) => (
              <div
                key={angle}
                // 放射方向がangle変数で動的に決まるためinline style
                style={{ position: "absolute", top: 0, left: 0, transform: `rotate(${angle}deg)`, transformOrigin: "0 0", width: 170, height: 0 }}
              >
                <span style={{
                  display: "block", position: "absolute", left: 30, top: -7,
                  width: count > 1 ? 16 : 12, height: count > 1 ? 16 : 12,
                  borderRadius: "50%",
                  // potion.colorHexは動的な値のためinline style
                  backgroundColor: `#${potion.colorHex}`,
                  boxShadow: `0 0 16px #${potion.colorHex}`,
                  // アニメーションdelayがiによって変わるためinline style
                  animation: `sparkleFly 0.72s cubic-bezier(0.2,0,0.4,1) ${i * 45}ms both`,
                }} />
              </div>
            ))}
          </div>

          {/* メインオーブ。colorHexが動的のためboxShadow・backgroundColorはinline style */}
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

          {/* ×N バッジ */}
          {count > 1 && (
            <div
              style={{ animation: "shelfBadgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) 300ms both" }}
              className={css({
                position: "absolute", bottom: "-10px", right: "-10px", zIndex: 3,
                bg: "#8B6914",
                border: "2px solid #c8a84b",
                borderRadius: "24px",
                px: "18px", py: "6px",
                fontSize: "26px", fontWeight: "bold", color: "#1a0e06",
                whiteSpace: "nowrap",
              })}
            >
              ×{count}
            </div>
          )}
        </div>

        {/* ポーション名 */}
        <h2 className={css({ fontSize: "48px", fontWeight: "bold", color: "#f0e6c8", m: "0 0 8px", letterSpacing: "0.06em" })}>
          {potion.name}
        </h2>
        <p className={css({ fontSize: "28px", color: "#c8a84b", m: "0 0 24px", letterSpacing: "0.08em", fontWeight: "bold" })}>
          Lv.{potion.level}
        </p>

        {/* 価格情報 */}
        <div className={css({
          bg: "rgba(200,168,75,0.08)",
          border: "1px solid rgba(200,168,75,0.22)",
          borderRadius: "14px",
          px: "44px", py: "20px",
          textAlign: "center",
          mb: "8px",
          minWidth: "300px",
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
