// アニメーション定数（DisplayScene がタイミング計算に使用するため export）
export const ANIM = {
  ENTER_DURATION: 600,
  ENTER_DELAY:    200,
  ARC_DURATION:   680,
  STAGGER:        260,
  MONEY_DURATION: 1300,
  MONEY_OFFSET:   560,
} as const;

export interface AnimationSlot {
  id: string;
  colorHex: string;
  image?: string;
  lineupX: number;
  dx: number;  // lineupX → CENTER_X
  dy: number;  // LINEUP_Y → CENTER_Y
  sellPrice: number;
}
