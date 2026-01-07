import { db, analysis, wordFrequency } from "../../src/infrastructure/db/index.js";
import { logger } from "../../src/lib/index.js";

export const seedAnalysis = async () => {
  const existing = await db.select().from(analysis).limit(1);
  if (existing.length > 0) {
    logger.info("[analysis] Already seeded, skipping...");
    return;
  }

  // サンプル分析データ
  const [inserted] = await db
    .insert(analysis)
    .values({
      title: "Sample Analysis",
      text: "The quick brown fox jumps over the lazy dog",
      totalWords: 9,
    })
    .returning({ id: analysis.id });

  if (inserted) {
    const totalWords = 9;
    await db.insert(wordFrequency).values([
      { analysisId: inserted.id, word: "the", count: 2, percentage: ((2 / totalWords) * 100).toFixed(2), rank: 1 },
      { analysisId: inserted.id, word: "quick", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 2 },
      { analysisId: inserted.id, word: "brown", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 3 },
      { analysisId: inserted.id, word: "fox", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 4 },
      { analysisId: inserted.id, word: "jumps", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 5 },
      { analysisId: inserted.id, word: "over", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 6 },
      { analysisId: inserted.id, word: "lazy", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 7 },
      { analysisId: inserted.id, word: "dog", count: 1, percentage: ((1 / totalWords) * 100).toFixed(2), rank: 8 },
    ]);
  }

  logger.info("[analysis] Seeded");
};
