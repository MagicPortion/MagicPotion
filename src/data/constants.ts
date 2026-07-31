export const TOTAL_DAYS = 5;
export const GOAL_MONEY = 10000;

export const formatDayLabel = (day: number, totalDays: number = TOTAL_DAYS) => {
  if (day >= totalDays) {
    return `最終日 / ${totalDays}日`;
  }
  return `${day}日目 / ${totalDays}日`;
};
