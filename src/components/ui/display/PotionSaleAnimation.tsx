import { playPotionSoldSound } from "../../../utils/sound";
import { getPotionImageUrl } from "../../../data/gameData";

// アニメーション定数（DisplayScene がタイミング計算に使用するため export）
export const ANIM = {
  ENTER_DURATION: 600,
  ENTER_DELAY:    200,
  ARC_DURATION:   680,
  STAGGER:        260,
  MONEY_DURATION: 1300,
  MONEY_OFFSET:   560,
} as const;

const ORB_SIZE  = 90;
const CENTER_X  = 1920 / 2;
const CENTER_Y  = 1080 / 2 - 20;
const LINEUP_Y  = 1080 - 150;

export interface AnimationSlot {
  id: string;
  colorHex: string;
  image?: string;
  lineupX: number;
  dx: number;  // lineupX → CENTER_X
  dy: number;  // LINEUP_Y → CENTER_Y
  sellPrice: number;
}

interface PotionSaleAnimationProps {
  slots: AnimationSlot[];
  launched: boolean;
}

export default function PotionSaleAnimation({ slots, launched }: PotionSaleAnimationProps) {
  return (
    <>
      {slots.map((s, i) => {
        const arcDelay   = i * ANIM.STAGGER;
        const moneyDelay = arcDelay + ANIM.MONEY_OFFSET;
        const imageUrl = getPotionImageUrl(s.image);

        return (
          <div key={s.id}>
            {/* ラインナップ位置ラッパー（上昇アニメ担当）: 座標が動的のためinline style */}
            <div
              style={{
                position: "absolute",
                left: s.lineupX - ORB_SIZE / 2,
                top: LINEUP_Y - ORB_SIZE / 2,
                animation: `lineupEnter ${ANIM.ENTER_DURATION}ms cubic-bezier(0.22,1,0.36,1) both`,
              }}
            >
              {/* ポーション（放物線アニメ担当） */}
              <div
                onAnimationStart={launched ? playPotionSoldSound : undefined}
                style={{
                  width: ORB_SIZE,
                  height: ORB_SIZE,
                  position: "relative",
                  borderRadius: imageUrl ? 0 : "50%",
                  backgroundColor: imageUrl ? "transparent" : `#${s.colorHex}`,
                  boxShadow: imageUrl ? "none" : `0 0 36px #${s.colorHex}99, 0 0 80px #${s.colorHex}44`,
                  ["--dx" as string]: `${s.dx}px`,
                  ["--dy" as string]: `${s.dy}px`,
                  ...(launched
                    ? { animation: `potionArc ${ANIM.ARC_DURATION}ms cubic-bezier(0.45,0,0.55,1) ${arcDelay}ms both` }
                    : {}),
                }}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    style={{
                      position: "absolute", inset: 0, width: ORB_SIZE, height: ORB_SIZE,
                      objectFit: "contain", pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            </div>

            {/* 売値テキスト（中央で出現・上昇・消滅）: 座標・アニメが動的のためinline style */}
            {launched && (
              <div
                style={{
                  position: "absolute",
                  left: CENTER_X,
                  top: CENTER_Y - 30,
                  fontSize: "40px",
                  fontWeight: 900,
                  color: "#64e6a0",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                  letterSpacing: "0.04em",
                  animation: `moneyPop ${ANIM.MONEY_DURATION}ms ease-out ${moneyDelay}ms both`,
                }}
              >
                +{s.sellPrice}G
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
