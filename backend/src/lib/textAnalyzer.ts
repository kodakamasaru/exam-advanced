/**
 * テキスト分析ロジック
 */

/**
 * 頻出単語の上位表示件数
 */
const TOP_WORDS_LIMIT = 10;

/**
 * 単語頻度
 */
export interface WordFrequencyResult {
  word: string;
  count: number;
}

/**
 * 分析結果
 */
export interface TextAnalysisResult {
  totalWords: number;
  frequencies: WordFrequencyResult[];
}

/**
 * テキストを分析して単語頻度を計算
 */
export const analyzeText = (text: string): TextAnalysisResult => {
  const words = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g) || [];
  const totalWords = words.length;

  if (totalWords === 0) {
    return { totalWords: 0, frequencies: [] };
  }

  const wordCounts = new Map<string, number>();
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }

  return {
    totalWords,
    frequencies: Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_WORDS_LIMIT)
      .map(([word, count]) => ({
        word,
        count,
      })),
  };
};
