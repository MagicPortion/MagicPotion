import { css } from "#styled-system/css";
import { MATERIALS } from "../../../data/gameData";
import Image from "../common/Image";
import type { MaterialDefWithUrl } from "../../../data/types";

interface OwnedMaterial extends MaterialDefWithUrl {
  count: number;
}

// 開発ルール：絵文字禁止のため枠を閉じる用のSVG
const IconClose = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface InventoryModalProps {
  materials: Record<string, number>;
  onClose: () => void;
}

export default function InventoryModal({ materials, onClose }: InventoryModalProps) {
  // 調合シーンと同じ MATERIALS の定義順（高レア度順）で所持素材を並べる
  const ownedItems: OwnedMaterial[] = MATERIALS.flatMap((material) => {
    const count = materials[material.id] ?? 0;
    return count > 0 ? [{ ...material, count }] : [];
  });

  const baseItems = ownedItems.filter((item) => item.category === "base");
  const accentItems = ownedItems.filter((item) => item.category === "accent");

  return (
    <div
      onClick={onClose}
      className={css({
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      })}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          width: "1400px",
          height: "880px",
          background: "parchment.bg",
          border: "2px solid",
          borderColor: "parchment.border",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
          padding: "40px",
          gap: "30px",
        })}
      >

        {/* 大きな持ち物一覧の看板リボン */}
        <div className={css({
          position: "relative",
          background: "parchment.bgSoft",
          color: "parchment.accent",
          border: "1px solid",
          borderColor: "parchment.border",
          fontSize: "35px",
          fontWeight: "900",
          py: "16px",
          textAlign: "center",
          letterSpacing: "0.2em",
          borderRadius: "12px",
          clipPath: "polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%)",
          width: "85%",
          margin: "0 auto",
        })}>
          持ち物一覧
        </div>

        {/* 右上のバツ閉じボタン */}
        <button
          data-sound="cancel"
          onClick={onClose}
          className={css({
            position: "absolute",
            top: "40px",
            right: "40px",
            background: "none",
            border: "none",
            color: "parchment.textMuted",
            cursor: "pointer",
            transition: "transform 0.1s",
            _hover: { color: "parchment.accent", transform: "scale(1.1)" },
          })}
        >
          <IconClose />
        </button>

        {/* スクロールエリア */}
        <div className={css({
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "45px",
          paddingRight: "10px",
        })}>

          {/* 🟥 上段：【Base 素材】セクション */}
          <div className={css({ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" })}>
            <div className={css({
              background: "parchment.bgSoft",
              color: "parchment.dangerBorder",
              border: "2px solid",
              borderColor: "parchment.danger",
              fontSize: "32px",
              fontWeight: "bold",
              px: "36px",
              py: "8px",
              borderRadius: "8px",
              display: "inline-block",
              width: "fit-content",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 14px rgba(166,83,79,0.2)"
            })}>
              Base 素材
            </div>

            <div className={css({ display: "flex", flexWrap: "wrap", gap: "28px", width: "100%" })}>
              {baseItems.length === 0 ? (
                /* ★ 修正ポイント：文字サイズを32pxに拡大し、whiteSpace: "nowrap" で絶対に改行させない1行に固定！ */
                <p className={css({
                  fontSize: "32px",
                  color: "parchment.danger",
                  fontWeight: "bold",
                  pl: "10px",
                  m: 0,
                  whiteSpace: "nowrap"
                })}>
                  持っている Base 素材はありません
                </p>
              ) : (
                baseItems.map((item) => <InventoryCard key={item.id} item={item} />)
              )}
            </div>
          </div>

          {/* 🟩 下段：【Accent 素材】セクション */}
          <div className={css({ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" })}>
            <div className={css({
              background: "parchment.bgSoft",
              color: "parchment.successText",
              border: "2px solid",
              borderColor: "parchment.success",
              fontSize: "32px",
              fontWeight: "bold",
              px: "36px",
              py: "8px",
              borderRadius: "8px",
              display: "inline-block",
              width: "fit-content",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 14px rgba(120,155,74,0.2)"
            })}>
              Accent 素材
            </div>

            <div className={css({ display: "flex", flexWrap: "wrap", gap: "28px", width: "100%" })}>
              {accentItems.length === 0 ? (
                /* ★ 修正ポイント：こちらも同様に32pxに拡大して、綺麗な1行に並ぶよう修正完了！ */
                <p className={css({
                  fontSize: "32px",
                  color: "parchment.success",
                  fontWeight: "bold",
                  pl: "10px",
                  m: 0,
                  whiteSpace: "nowrap"
                })}>
                  持っている Accent 素材はありません
                </p>
              ) : (
                accentItems.map((item) => <InventoryCard key={item.id} item={item} />)
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// 素材画像とテキストのみ（カード枠なし。ShopCardと同じ考え方）
function InventoryCard({ item }: { item: OwnedMaterial }) {
  return (
    <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", width: "180px" })}>
      <div className={css({
        position: "relative",
        background: "parchment.bgSoft",
        border: "2px solid",
        borderColor: item.category === "base" ? "parchment.danger" : "parchment.success",
        borderRadius: "12px",
        width: "180px",
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}>
        <Image src={item.imageUrl} alt={item.name} width={160} height={160} />

        {/* 個数バッジ。素材画像に重ねて表示 */}
        <span className={css({
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "parchment.surface",
          color: "parchment.accent",
          border: "1px solid",
          borderColor: "parchment.border",
          fontSize: "26px",
          fontWeight: "bold",
          px: "12px",
          py: "2px",
          borderRadius: "6px",
        })}>
          {`×${item.count}`}
        </span>
      </div>

      {/* 素材名（カード外）。1行で表示し、見切れさせない */}
      <div className={css({
        fontSize: "26px",
        fontWeight: "bold",
        color: "parchment.text",
        mt: "10px",
        whiteSpace: "nowrap",
        textAlign: "center",
      })}>
        {item.name}
      </div>
    </div>
  );
}
