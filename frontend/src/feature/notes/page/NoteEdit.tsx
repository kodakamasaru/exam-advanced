/**
 * ノート編集ページ
 */

import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { Layout, Alert } from "../../../component";
import { NoteForm } from "../component/NoteForm";
import { noteApi } from "../api";
import { formatDateJa } from "../../../lib/date";
import { noteRoutes } from "../routes";
import type { Note } from "../types";

interface NoteEditProps {
  path?: string;
  id?: string;
}

export function NoteEdit({ id }: NoteEditProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        setError("不正なURLです");
        setIsLoading(false);
        return;
      }

      const noteId = parseInt(id, 10);
      if (isNaN(noteId)) {
        setError("不正なURLです");
        setIsLoading(false);
        return;
      }

      const result = await noteApi.find(noteId);
      setIsLoading(false);

      if (result.ok) {
        setNote(result.data);
      } else {
        setError(result.error);
      }
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (title: string, content: string) => {
    if (!note) return;

    const result = await noteApi.update(note.id, { title, content });
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
      <h1 class="page-title">ノート編集</h1>

      {isLoading ? (
        <p class="empty-message">読み込み中...</p>
      ) : note ? (
        <>
          <NoteForm
            initialTitle={note.title}
            initialContent={note.content}
            submitLabel="更新"
            loadingLabel="更新中..."
            onSubmit={handleSubmit}
            onCancel={() => route(noteRoutes.list.to())}
          />
          <div class="form-group">
            <div class="note-item__meta">作成日時: {formatDateJa(note.createdAt)}</div>
          </div>
        </>
      ) : null}
    </Layout>
  );
}
