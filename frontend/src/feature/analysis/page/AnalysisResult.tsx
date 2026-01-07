/**
 * 分析結果ページ
 */

import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { Layout } from "../../../component";
import { formatDateJa, ApiError } from "../../../lib";
import { getAnalysis, getCsvDownloadUrl } from "../api";
import type { Analysis } from "../types";

interface AnalysisResultProps {
  path: string;
  id?: string;
}

export function AnalysisResult({ id }: AnalysisResultProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      route("/not-found", true);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const data = await getAnalysis(id);
        setAnalysis(data);
        setLoading(false);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          route("/not-found", true);
        } else {
          route("/error", true);
        }
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleBack = () => {
    route("/");
  };

  const handleExportCsv = () => {
    if (id) {
      window.location.href = getCsvDownloadUrl(id);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div class="loading">読み込み中...</div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div class="loading">読み込み中...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="page-header">
        <h1 class="page-title">分析結果</h1>
        <div class="page-header__actions">
          <button class="btn btn--secondary" onClick={handleExportCsv}>
            CSVエクスポート
          </button>
          <button class="btn btn--secondary" onClick={handleBack}>
            戻る
          </button>
        </div>
      </div>

      <div class="result-info">
        <div class="result-info__item">
          <span class="result-info__label">タイトル</span>
          <span class="result-info__value">
            {analysis.title || "タイトルなし"}
          </span>
        </div>
        <div class="result-info__item">
          <span class="result-info__label">分析日時</span>
          <span class="result-info__value">
            {formatDateJa(analysis.createdAt)}
          </span>
        </div>
        <div class="result-info__item">
          <span class="result-info__label">総単語数</span>
          <span class="result-info__value">{analysis.totalWords}</span>
        </div>
      </div>

      <div class="result-section">
        <h2 class="result-section__title">入力テキスト</h2>
        <div class="result-text">{analysis.text}</div>
      </div>

      <div class="result-section">
        <h2 class="result-section__title">出現頻度上位10単語</h2>
        {analysis.frequencies.length === 0 ? (
          <p>単語が見つかりませんでした</p>
        ) : (
          <table class="frequency-table">
            <thead>
              <tr>
                <th>順位</th>
                <th>単語</th>
                <th>出現回数</th>
                <th>出現率(%)</th>
              </tr>
            </thead>
            <tbody>
              {analysis.frequencies.map((freq) => (
                <tr key={freq.rank}>
                  <td>{freq.rank}</td>
                  <td>{freq.word}</td>
                  <td>{freq.count}</td>
                  <td>{freq.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
