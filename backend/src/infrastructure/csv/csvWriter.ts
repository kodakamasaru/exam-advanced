/**
 * 汎用 CSV Writer
 * 外部システム（ファイルダウンロード）との境界を担当
 */

type CsvValue = string | number | boolean | null | undefined;

export const CsvWriter = {
  /**
   * CSV形式の文字列を生成
   * @param headers ヘッダー行の配列
   * @param rows データ行の配列（各行は値の配列）
   * @returns BOM付きUTF-8のCSV文字列
   */
  write: (headers: string[], rows: CsvValue[][]): string => {
    const BOM = "\uFEFF";
    const headerLine = headers.map(escapeCsvField).join(",");
    const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));

    return BOM + headerLine + "\n" + dataLines.join("\n");
  },
};

/**
 * CSVフィールドのエスケープ
 */
const escapeCsvField = (value: CsvValue): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);
  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};
