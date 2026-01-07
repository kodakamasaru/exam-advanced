/**
 * 単語頻度分析エンティティ
 */

/**
 * 単語頻度
 */
export interface WordFrequency {
  id: number;
  analysisId: string;
  word: string;
  count: number;
  percentage: string;
  rank: number;
}

/**
 * 分析結果
 */
export interface Analysis {
  id: string;
  title: string | null;
  text: string;
  totalWords: number;
  createdAt: Date;
}

/**
 * 分析結果（頻度データ付き）
 */
export interface AnalysisWithFrequencies extends Analysis {
  frequencies: WordFrequency[];
}
