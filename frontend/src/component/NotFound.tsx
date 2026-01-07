/**
 * 404ページ
 */

import { route } from "preact-router";
import { Layout } from "./Layout";

interface NotFoundProps {
  default?: boolean;
}

export function NotFound(_props: NotFoundProps) {
  return (
    <Layout>
      <div class="status-page">
        <h1 class="page-title">ページが見つかりません</h1>
        <p class="status-page__message">お探しのページは存在しないか、移動した可能性があります。</p>
        <button onClick={() => route("/")} class="btn btn--primary">
          トップに戻る
        </button>
      </div>
    </Layout>
  );
}
