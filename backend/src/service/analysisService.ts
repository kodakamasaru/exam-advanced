/**
 * 分析サービス
 * ビジネスロジックのみを担当（レスポンス変換は Controller で行う）
 */

import { analysisRepository } from "../repository/index.js";
import { analyzeText } from "../lib/index.js";
import type { Analysis, AnalysisWithFrequencies } from "../entity/index.js";

/**
 * 分析履歴の最大保持件数
 */
const MAX_HISTORY_COUNT = 10;

export const analysisService = {
  /**
   * 分析履歴一覧取得
   */
  getAll: async (): Promise<Analysis[]> => {
    return analysisRepository.findAll();
  },

  /**
   * 分析結果取得
   */
  getById: async (id: string): Promise<AnalysisWithFrequencies | null> => {
    return analysisRepository.findById(id);
  },

  /**
   * 分析実行・保存
   */
  analyze: async (title: string, text: string): Promise<string> => {
    // 10件制限チェック
    const count = await analysisRepository.count();
    if (count >= MAX_HISTORY_COUNT) {
      await analysisRepository.deleteOldest();
    }

    // 分析実行
    const { totalWords, frequencies } = analyzeText(text);

    // 保存
    const id = await analysisRepository.create(
      {
        title: title.trim() || null,
        text: text.trim(),
        totalWords,
      },
      frequencies
    );

    return id;
  },
};
