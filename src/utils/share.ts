import type { DailyFinanceReport } from "../store/useGameStore";
import { GOAL_MONEY, TOTAL_DAYS } from "../data/constants";

export const GAME_URL = "https://magicportion.github.io/MagicPotion/";

export interface ShareStats {
  money: number;
  dailyFinanceReports: DailyFinanceReport[];
}

export interface ResultParams {
  money: number;
  totalIncome: number;
  totalExpense: number;
}

const PARAM_MONEY = "m";
const PARAM_INCOME = "i";
const PARAM_EXPENSE = "e";

function toResultTotals({ money, dailyFinanceReports }: ShareStats): ResultParams {
  const totalIncome = dailyFinanceReports.reduce((sum, report) => sum + report.income, 0);
  const totalExpense = dailyFinanceReports.reduce((sum, report) => sum + report.expense, 0);
  return { money, totalIncome, totalExpense };
}

function resultSummaryLines({ money, totalIncome, totalExpense }: ResultParams) {
  const isClear = money >= GOAL_MONEY;
  const resultLine = isClear
    ? `借金${GOAL_MONEY.toLocaleString()}Gの返済を完了して、賑わうお店を経営できた！`
    : "借金を返済できず、魔女の店は更地に…もう一度挑戦する！";

  return [
    `${TOTAL_DAYS}日間の魔法薬屋経営の結果…`,
    `総収入: ${totalIncome.toLocaleString()}G / 総支出: ${totalExpense.toLocaleString()}G`,
    `所持金: ${money.toLocaleString()}G`,
    resultLine,
  ];
}

export function buildShareText(stats: ShareStats) {
  return ["【Magic Potion】", ...resultSummaryLines(toResultTotals(stats))].join("\n");
}

export function buildShareUrl(stats: ShareStats) {
  const { money, totalIncome, totalExpense } = toResultTotals(stats);
  const url = typeof window !== "undefined" ? new URL(window.location.href) : new URL(GAME_URL);
  url.search = "";
  url.hash = "";
  url.searchParams.set(PARAM_MONEY, String(Math.max(0, Math.round(money))));
  url.searchParams.set(PARAM_INCOME, String(Math.max(0, Math.round(totalIncome))));
  url.searchParams.set(PARAM_EXPENSE, String(Math.max(0, Math.round(totalExpense))));
  return url.toString();
}

export function parseResultParams(search: string): ResultParams | null {
  const params = new URLSearchParams(search);
  if (![PARAM_MONEY, PARAM_INCOME, PARAM_EXPENSE].every((key) => params.has(key))) return null;
  const money = Number(params.get(PARAM_MONEY));
  const totalIncome = Number(params.get(PARAM_INCOME));
  const totalExpense = Number(params.get(PARAM_EXPENSE));
  if (![money, totalIncome, totalExpense].every((n) => Number.isFinite(n) && n >= 0)) return null;
  return { money, totalIncome, totalExpense };
}

export function resultSummaryText(result: ResultParams) {
  return resultSummaryLines(result).join("\n");
}

export function openTwitterShare(stats: ShareStats) {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", buildShareText(stats));
  url.searchParams.set("url", buildShareUrl(stats));
  url.searchParams.set("hashtags", "MagicPotion");
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}
