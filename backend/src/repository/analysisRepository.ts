/**
 * 分析リポジトリ
 */

import { asc, count, desc, eq } from "drizzle-orm";
import { db, analysis, wordFrequency } from "../infrastructure/index.js";
import type { AnalysisWithFrequencies } from "../entity/index.js";

/**
 * 分析結果の永続化データ
 */
interface CreateAnalysisData {
  title: string | null;
  text: string;
  totalWords: number;
}

/**
 * 単語頻度の永続化データ
 */
interface CreateWordFrequencyData {
  word: string;
  count: number;
  percentage: string;
  rank: number;
}

export const analysisRepository = {
  /**
   * 全件取得（作成日時降順）
   */
  findAll: async () => {
    return db.query.analysis.findMany({
      orderBy: [desc(analysis.createdAt)],
    });
  },

  /**
   * ID指定で取得（頻度データ付き）
   */
  findById: async (id: string): Promise<AnalysisWithFrequencies | null> => {
    const result = await db.query.analysis.findFirst({
      where: eq(analysis.id, id),
    });

    if (!result) {
      return null;
    }

    const frequencies = await db.query.wordFrequency.findMany({
      where: eq(wordFrequency.analysisId, id),
      orderBy: [desc(wordFrequency.count)],
    });

    return {
      ...result,
      frequencies,
    };
  },

  /**
   * 作成
   */
  create: async (
    data: CreateAnalysisData,
    frequencies: CreateWordFrequencyData[]
  ): Promise<string> => {
    const [inserted] = await db
      .insert(analysis)
      .values({
        title: data.title,
        text: data.text,
        totalWords: data.totalWords,
      })
      .returning({ id: analysis.id });

    if (!inserted) {
      throw new Error("Failed to insert analysis");
    }

    if (frequencies.length > 0) {
      await db.insert(wordFrequency).values(
        frequencies.map((f) => ({
          analysisId: inserted.id,
          word: f.word,
          count: f.count,
          percentage: f.percentage,
          rank: f.rank,
        }))
      );
    }

    return inserted.id;
  },

  /**
   * 件数取得
   */
  count: async (): Promise<number> => {
    const [result] = await db.select({ count: count() }).from(analysis);
    return result?.count ?? 0;
  },

  /**
   * 最も古いレコードを削除
   */
  deleteOldest: async (): Promise<void> => {
    const oldest = await db.query.analysis.findFirst({
      orderBy: [asc(analysis.createdAt)],
    });

    if (oldest) {
      await db.delete(analysis).where(eq(analysis.id, oldest.id));
    }
  },
};
