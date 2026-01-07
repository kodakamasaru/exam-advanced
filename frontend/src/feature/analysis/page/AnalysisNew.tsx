/**
 * 新規分析ページ
 */

import { useState } from "preact/hooks";
import { route } from "preact-router";
import { Layout, Alert } from "../../../component";
import { ApiError } from "../../../lib";
import { AnalysisForm } from "../component/AnalysisForm";
import { createAnalysis } from "../api";

interface AnalysisNewProps {
  path: string;
}

export function AnalysisNew(_props: AnalysisNewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (title: string, text: string) => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createAnalysis({ title, text });
      route(`/result/${result.id}`);
    } catch (e) {
      if (e instanceof ApiError) {
        // バリデーションエラー（400/422）は居座りAlert
        if (e.status === 400 || e.status === 422) {
          setError(e.getUserMessage());
        } else {
          // それ以外（500系、ネットワークエラー等）はエラーページへ
          route("/error", true);
          return;
        }
      } else {
        route("/error", true);
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    route("/");
  };

  return (
    <Layout>
      <div class="page-header">
        <h1 class="page-title">新規分析</h1>
        <button class="btn btn--secondary" onClick={handleBack}>
          戻る
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <AnalysisForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Layout>
  );
}
