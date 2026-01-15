/**
 * 分析API モックデータ
 */

import type { Analysis } from "../../feature/analysis/types";

export const mockAnalyses: Analysis[] = [
  {
    id: "1",
    title: "サンプル分析1",
    text: "これはサンプルのテキストです。テストデータとして使用されます。",
    totalWords: 25,
    createdAt: "2025-01-15T10:00:00Z",
    frequencies: [
      { word: "サンプル", count: 2, percentage: "8.00", rank: 1 },
      { word: "テスト", count: 1, percentage: "4.00", rank: 2 },
      { word: "データ", count: 1, percentage: "4.00", rank: 3 },
    ],
  },
  {
    id: "2",
    title: "サンプル分析2",
    text: "別のサンプルテキストです。モック環境で動作確認に使用します。",
    totalWords: 18,
    createdAt: "2025-01-14T15:30:00Z",
    frequencies: [
      { word: "サンプル", count: 1, percentage: "5.56", rank: 1 },
      { word: "モック", count: 1, percentage: "5.56", rank: 2 },
      { word: "環境", count: 1, percentage: "5.56", rank: 3 },
    ],
  },
  {
    id: "3",
    title: null,
    text: "タイトルなしの分析です。",
    totalWords: 8,
    createdAt: "2025-01-13T09:00:00Z",
    frequencies: [
      { word: "タイトル", count: 1, percentage: "12.50", rank: 1 },
      { word: "分析", count: 1, percentage: "12.50", rank: 2 },
    ],
  },
];
