/**
 * 分析コントローラー
 * HTTPリクエスト/レスポンスの処理とDTO変換を担当
 */

import { Hono } from "hono";
import {
  CreateAnalysisSchema,
  type CreateAnalysisRequest,
  type ErrorResponse,
  type AnalysisListItemResponse,
  type AnalysisResponse,
} from "../dto/index.js";
import { createValidatorFromSchema } from "../lib/index.js";
import {
  validate,
  getValidatedBody,
  parseId,
  getParsedId,
} from "../middleware/index.js";
import { analysisService } from "../service/index.js";
import { CsvWriter } from "../infrastructure/index.js";

export const analysisController = new Hono();

const TEXT_PREVIEW_MAX_LENGTH = 200;
const ERROR_ANALYSIS_NOT_FOUND = "分析結果が見つかりません";

/**
 * 日付をISO文字列に変換
 */
const formatDate = (date: Date): string => date.toISOString();

/**
 * 分析履歴一覧取得
 * GET /api/analyses
 */
analysisController.get("/", async (ctx) => {
  const analyses = await analysisService.getAll();

  const response: AnalysisListItemResponse[] = analyses.map((a) => ({
    id: a.id,
    title: a.title,
    textPreview: a.text.slice(0, TEXT_PREVIEW_MAX_LENGTH),
    totalWords: a.totalWords,
    createdAt: formatDate(a.createdAt),
  }));

  return ctx.json(response);
});

/**
 * 分析実行
 * POST /api/analyses
 */
analysisController.post(
  "/",
  validate<CreateAnalysisRequest>(
    createValidatorFromSchema<CreateAnalysisRequest>(CreateAnalysisSchema)
  ),
  async (ctx) => {
    const body = getValidatedBody<CreateAnalysisRequest>(ctx);
    const id = await analysisService.analyze(body.title, body.text);
    return ctx.json({ id }, 201);
  }
);

/**
 * 分析結果取得
 * GET /api/analyses/:id
 */
analysisController.get("/:id", parseId(), async (ctx) => {
  const id = getParsedId(ctx);
  const analysis = await analysisService.getById(id);

  if (!analysis) {
    return ctx.json<ErrorResponse>({ error: ERROR_ANALYSIS_NOT_FOUND }, 404);
  }

  const response: AnalysisResponse = {
    id: analysis.id,
    title: analysis.title,
    text: analysis.text,
    totalWords: analysis.totalWords,
    createdAt: formatDate(analysis.createdAt),
    frequencies: analysis.frequencies.map((f) => ({
      word: f.word,
      count: f.count,
      percentage: f.percentage,
      rank: f.rank,
    })),
  };

  return ctx.json(response);
});

/**
 * CSVエクスポート
 * GET /api/analyses/:id/csv
 */
analysisController.get("/:id/csv", parseId(), async (ctx) => {
  const id = getParsedId(ctx);
  const analysis = await analysisService.getById(id);

  if (!analysis) {
    return ctx.json<ErrorResponse>({ error: ERROR_ANALYSIS_NOT_FOUND }, 404);
  }

  const headers = ["順位", "単語", "出現回数", "出現率(%)"];
  const rows = analysis.frequencies.map((f) => [
    f.rank,
    f.word,
    f.count,
    f.percentage,
  ]);
  const csv = CsvWriter.write(headers, rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(analysis.title || "分析結果")}_${analysis.createdAt.toISOString().replace(/[:.]/g, "-")}.csv"`,
    },
  });
});
