/**
 * 分析履歴一覧ページ
 */

import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { Layout } from "../../../component";
import { formatDateJa } from "../../../lib";
import { getAnalyses } from "../api";
import type { AnalysisListItem } from "../types";

interface AnalysisListProps {
  path: string;
}

export function AnalysisList(_props: AnalysisListProps) {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getAnalyses();
        setAnalyses(data);
        setLoading(false);
      } catch {
        route("/error", true);
      }
    };

    fetchAnalyses();
  }, []);

  const handleNewAnalysis = () => {
    route("/new");
  };

  const handleViewResult = (id: string) => {
    route(`/result/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div class="loading">読み込み中...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="page-header">
        <h1 class="page-title">単語頻度分析</h1>
        <p class="page-description">
          英語の文章を入力すると、頻出単語をランキング形式で表示します。
        </p>
        <button class="btn btn--primary" onClick={handleNewAnalysis}>
          新規分析
        </button>
      </div>

      {analyses.length === 0 ? (
        <div class="empty-state">
          <p>分析履歴がありません</p>
          <p>「新規分析」ボタンから分析を始めましょう</p>
        </div>
      ) : (
        <div class="card-list">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              class="card card--clickable"
              onClick={() => handleViewResult(analysis.id)}
            >
              <div class="card__title">
                {analysis.title || "タイトルなし"}
              </div>
              <div class="card__preview">{analysis.textPreview}</div>
              <div class="card__meta">
                <span>{formatDateJa(analysis.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
