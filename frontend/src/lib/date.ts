/**
 * 日付フォーマットユーティリティ
 */

/**
 * 日付を日本語形式でフォーマット
 */
export function formatDateJa(dateString: string): string {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
