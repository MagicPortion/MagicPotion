import { css } from "#styled-system/css";
import type { ReactNode } from "react";

interface ArrowBannerProps {
  children: ReactNode;
  /** タイトルの文字サイズ。省略時 "42px" */
  fontSize?: string;
  /** 左右パディング。省略時 "160px" */
  paddingX?: string;
  /** 上下パディング。省略時 "14px" */
  paddingY?: string;
  /** バナー幅。省略時は内容に合わせる(auto) */
  width?: string;
  /** 幅指定時に中央寄せするか。省略時 true */
  centered?: boolean;
  /** 左右の矢印の内側オフセット。省略時 "40px" */
  arrowInset?: string;
}

/**
 * 「◀ タイトル ▶」の青いバナー見出し。
 * ショップ・レシピ習得画面など複数箇所で共通利用する。
 */
export default function ArrowBanner({
  children,
  fontSize = "42px",
  paddingX = "160px",
  paddingY = "14px",
  width,
  centered = true,
  arrowInset = "40px",
}: ArrowBannerProps) {
  const arrow = css({ position: "absolute", color: "white" });
  return (
    <div
      className={css({
        position: "relative",
        bg: "#46a1ea",
        color: "white",
        fontWeight: "bold",
        borderRadius: "10px",
        letterSpacing: "0.2em",
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      })}
      // fontSize / padding / width は呼び出し側の動的値のため inline style
      style={{
        fontSize,
        padding: `${paddingY} ${paddingX}`,
        width,
        marginLeft: width && centered ? "auto" : undefined,
        marginRight: width && centered ? "auto" : undefined,
      }}
    >
      <span className={arrow} style={{ left: arrowInset }}>◀</span>
      {children}
      <span className={arrow} style={{ right: arrowInset }}>▶</span>
    </div>
  );
}
