/**
 * 分析API ハンドラー
 */

import { http, HttpResponse, delay } from "msw";
import type {
  Analysis,
  AnalysisListItem,
  CreateAnalysisRequest,
  CreateAnalysisResponse,
} from "../../feature/analysis/types";
import { mockAnalyses } from "../fixtures/analyses";

let nextId = mockAnalyses.length + 1;

export const handlers = [
  /**
   * 分析一覧取得
   */
  http.get("/api/analyses", async () => {
    await delay(300);

    const response: AnalysisListItem[] = mockAnalyses.map((a) => ({
      id: a.id,
      title: a.title,
      textPreview: a.text.slice(0, 50) + (a.text.length > 50 ? "..." : ""),
      totalWords: a.totalWords,
      createdAt: a.createdAt,
    }));

    return HttpResponse.json(response);
  }),

  /**
   * 分析詳細取得
   */
  http.get("/api/analyses/:id", async ({ params }) => {
    await delay(200);

    const analysis = mockAnalyses.find((a) => a.id === params.id);
    if (!analysis) {
      return HttpResponse.json(
        { error: "分析結果が見つかりません" },
        { status: 404 }
      );
    }

    return HttpResponse.json(analysis);
  }),

  /**
   * 分析作成
   */
  http.post("/api/analyses", async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as CreateAnalysisRequest;

    const id = String(nextId++);
    const newAnalysis: Analysis = {
      id,
      title: body.title || null,
      text: body.text,
      totalWords: body.text.split(/\s+/).length,
      createdAt: new Date().toISOString(),
      frequencies: [
        { word: "モック", count: 1, percentage: "10.00", rank: 1 },
        { word: "データ", count: 1, percentage: "10.00", rank: 2 },
      ],
    };

    mockAnalyses.unshift(newAnalysis);

    const response: CreateAnalysisResponse = { id };
    return HttpResponse.json(response, { status: 201 });
  }),

  /**
   * CSV エクスポート
   */
  http.get("/api/analyses/:id/csv", async ({ params }) => {
    await delay(200);

    const analysis = mockAnalyses.find((a) => a.id === params.id);
    if (!analysis) {
      return HttpResponse.json(
        { error: "分析結果が見つかりません" },
        { status: 404 }
      );
    }

    const headers = ["順位", "単語", "出現回数", "出現率(%)"];
    const rows = analysis.frequencies.map((f) =>
      [f.rank, f.word, f.count, f.percentage].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    return new HttpResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(analysis.title || "分析結果")}.csv"`,
      },
    });
  }),
];
