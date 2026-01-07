/**
 * 分析機能の型定義
 */

/**
 * 単語頻度
 */
export interface WordFrequency {
  word: string;
  count: number;
  percentage: string;
  rank: number;
}

/**
 * 分析結果（一覧用）
 */
export interface AnalysisListItem {
  id: string;
  title: string | null;
  textPreview: string;
  totalWords: number;
  createdAt: string;
}

/**
 * 分析結果（詳細用）
 */
export interface Analysis {
  id: string;
  title: string | null;
  text: string;
  totalWords: number;
  createdAt: string;
  frequencies: WordFrequency[];
}

/**
 * 分析リクエスト
 */
export interface CreateAnalysisRequest {
  title: string;
  text: string;
}

/**
 * 分析作成レスポンス
 */
export interface CreateAnalysisResponse {
  id: string;
}

/**
 * フォームフィールド名
 */
export type AnalysisFormField = "title" | "text";
