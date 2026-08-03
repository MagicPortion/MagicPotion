import type { ReactNode } from "react";
import { css } from "#styled-system/css";
import { token } from "#styled-system/tokens";

interface ItemCardProps {
  /** カード中央に表示する画像・ColorOrbなど */
  visual: ReactNode;
  /** 枠の外に表示する名前ラベル */
  label: ReactNode;
  /** 枠（正方形）のサイズ。持ち物一覧のカードに合わせてデフォルト180px */
  size?: number;
  /** inline styleで使うため、渡す値はtoken()で解決済みのCSS色にすること（"parchment.xxx"のような文字列は不可） */
  borderColor: string;
  background?: string;
  labelColor?: string;
  /** 枠の右下に重ねるバッジ（個数など） */
  badge?: ReactNode;
  /** ラベルの下に追加する行（価格・Lvなど） */
  footer?: ReactNode;
  /** ラベルを折り返す行数。1なら1行固定で見切れさせない（デフォルト）、2なら2行まで折り返しを許可 */
  labelLines?: 1 | 2;
  onClick?: () => void;
  /** クリックして選ぶカードの場合、選択中は光るリングと浮き上がりで強調する */
  selected?: boolean;
}

// 持ち物一覧・レシピ選択・レシピ帳など、素材/ポーションを画像＋名前で見せるカードの共通レイアウト。
// 画像を大きく・名前を控えめなサイズで揃えることで、画面ごとにサイズ感がバラつくのを防ぐ。
export default function ItemCard({
  visual,
  label,
  size = 180,
  borderColor,
  background = token("colors.parchment.bgSoft"),
  labelColor = token("colors.parchment.text"),
  badge,
  footer,
  labelLines = 1,
  onClick,
  selected = false,
}: ItemCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", width: `${size}px` })}>
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        style={{
          width: size, height: size, background, borderColor,
          transform: selected ? "translateY(-6px) scale(1.04)" : "none",
          boxShadow: selected ? "0 0 0 4px rgba(200,168,75,0.24), 0 12px 32px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.32)",
        }}
        className={css({
          position: "relative",
          border: "2px solid",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: onClick ? "pointer" : "default",
          transition: "all 0.18s",
          _hover: onClick ? { transform: "translateY(-6px) scale(1.04)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" } : {},
        })}
      >
        {visual}
        {badge && (
          <span
            style={{ background: token("colors.parchment.surface"), borderColor: token("colors.parchment.border") }}
            className={css({
              position: "absolute",
              bottom: "10px",
              right: "10px",
              color: "parchment.accent",
              border: "1px solid",
              fontSize: "26px",
              fontWeight: "bold",
              px: "12px",
              py: "2px",
              borderRadius: "6px",
            })}
          >
            {badge}
          </span>
        )}
      </Wrapper>

      <div
        style={{ color: labelColor, whiteSpace: labelLines === 1 ? "nowrap" : "normal" }}
        className={css({
          fontSize: "26px",
          fontWeight: "bold",
          mt: "10px",
          lineHeight: 1.25,
          textAlign: "center",
        })}
      >
        {label}
      </div>
      {footer}
    </div>
  );
}
