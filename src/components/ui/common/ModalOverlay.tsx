import { css } from "#styled-system/css";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

interface ModalOverlayProps {
  children: ReactNode;
  /** バックドロップの背景色。省略時は "rgba(0,0,0,0.6)" */
  backdrop?: string;
  /** overlay 全体の z-index。シーンごとの重なり順に合わせて指定 */
  zIndex?: number;
  /** backdrop-filter の blur 量(px)。省略時はぼかしなし */
  blur?: number;
  /** 子要素を flex で中央寄せするか。省略時は true */
  center?: boolean;
  /**
   * オーバーレイのクリック時に呼ばれる処理(閉じる等)。未指定ならクリックしても閉じない。
   * 中身を閉じたくない要素は子側で onClick に stopPropagation を付ける。
   */
  onBackdropClick?: (e: MouseEvent<HTMLDivElement>) => void;
  /** アニメーション等の動的スタイル用 inline style */
  style?: CSSProperties;
}

/**
 * フルスクリーンのモーダル用オーバーレイ。
 * position:absolute で親いっぱいに広がり、任意で子要素を中央寄せする。
 * onBackdropClick を渡すとオーバーレイのクリックで発火する
 * (伝播を止めたい子要素は自身で stopPropagation する)。
 */
export default function ModalOverlay({
  children,
  backdrop = "rgba(0,0,0,0.6)",
  zIndex = 100,
  blur,
  center = true,
  onBackdropClick,
  style,
}: ModalOverlayProps) {
  return (
    <div
      onClick={onBackdropClick}
      // backgroundColor / zIndex / backdropFilter は呼び出し側の動的値のため inline style
      style={{
        backgroundColor: backdrop,
        zIndex,
        backdropFilter: blur != null ? `blur(${blur}px)` : undefined,
        ...style,
      }}
      className={css({
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: center ? "center" : "stretch",
        justifyContent: center ? "center" : "flex-start",
      })}
    >
      {children}
    </div>
  );
}
