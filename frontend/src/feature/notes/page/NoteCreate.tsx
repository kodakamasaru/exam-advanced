/**
 * ノート新規作成ページ
 */

import { useState } from "preact/hooks";
import { route } from "preact-router";
import { Layout, Alert } from "../../../component";
import { NoteForm } from "../component/NoteForm";
import { noteApi } from "../api";
import { noteRoutes } from "../routes";

interface NoteCreateProps {
  path?: string;
}

export function NoteCreate(_props: NoteCreateProps) {
  const [error, setError] = useState("");

  const handleSubmit = async (title: string, content: string) => {
    const result = await noteApi.create({ title, content });
    if (result.ok) {
      route(noteRoutes.list.to());
    } else {
      setError(result.error);
    }
  };

  return (
    <Layout>
      <Alert type="error" message={error} onClose={() => setError("")} />

      <a href={noteRoutes.list.to()} class="back-link" onClick={(e) => { e.preventDefault(); route(noteRoutes.list.to()); }}>
        ← 一覧に戻る
      </a>
      <h1 class="page-title">新規ノート作成</h1>

      <NoteForm
        submitLabel="作成"
        loadingLabel="作成中..."
        onSubmit={handleSubmit}
        onCancel={() => route(noteRoutes.list.to())}
      />
    </Layout>
  );
}
