/**
 * 汎用エラーページ
 */

import { route } from "preact-router";
import { Layout } from "./Layout";

interface ErrorPageProps {
  path?: string;
  message?: string;
}

export function ErrorPage({ message }: ErrorPageProps) {
  const displayMessage = message || "予期しないエラーが発生しました";

  return (
    <Layout>
      <div class="status-page">
        <h1 class="page-title">エラーが発生しました</h1>
        <p class="status-page__message">{displayMessage}</p>
        <button onClick={() => route("/")} class="btn btn--primary">
          トップに戻る
        </button>
      </div>
    </Layout>
  );
}
