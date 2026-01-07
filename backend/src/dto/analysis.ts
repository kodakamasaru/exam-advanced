/**
 * 分析関連DTO
 */

import type { ValidationSchema } from "../lib/validator.js";

/**
 * 分析リクエストDTO
 */
export interface CreateAnalysisRequest {
  title: string;
  text: string;
}

/**
 * 分析リクエストバリデーションスキーマ
 */
export const CreateAnalysisSchema = {
  title: {
    label: "タイトル",
    rules: [{ type: "maxLength", value: 30 }],
  },
  text: {
    label: "本文",
    rules: [
      { type: "required" },
      { type: "maxLength", value: 10000 },
      {
        type: "pattern",
        value: /^[a-zA-Z\s]*$/,
        message: "{label}は英語とスペースのみで入力してください",
      },
    ],
  },
} as const satisfies ValidationSchema<CreateAnalysisRequest>;

/**
 * 単語頻度レスポンスDTO
 */
export interface WordFrequencyResponse {
  word: string;
  count: number;
  percentage: string;
  rank: number;
}

/**
 * 分析結果レスポンスDTO（一覧用）
 */
export interface AnalysisListItemResponse {
  id: string;
  title: string | null;
  textPreview: string;
  totalWords: number;
  createdAt: string;
}

/**
 * 分析結果レスポンスDTO（詳細用）
 */
export interface AnalysisResponse {
  id: string;
  title: string | null;
  text: string;
  totalWords: number;
  createdAt: string;
  frequencies: WordFrequencyResponse[];
}

