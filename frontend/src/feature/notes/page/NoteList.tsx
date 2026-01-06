/**
 * ノート一覧ページ
 */

import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { Layout, Alert } from "../../../component";
import { noteApi } from "../api";
import { formatDateJa } from "../../../lib/date";
import { noteRoutes } from "../routes";
import type { Note } from "../types";

interface NoteListProps {
  path?: string;
}

export function NoteList(_props: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await noteApi.list();
      if (result.ok) {
        setNotes(result.data);
      } else {
        setError(result.error);
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    const result = await noteApi.delete(id);
    if (result.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSuccess("ノートを削除しました");
    } else {
      setError(result.error);
    }
  };

  return (
    <Layout>
      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div class="page-header">
        <h1 class="page-title">ノート一覧</h1>
        <button onClick={() => route(noteRoutes.create.to())} class="btn btn--primary">
          新規作成
        </button>
      </div>

      {notes.length === 0 ? (
        <p class="empty-message">ノートがありません。新しいノートを作成してください。</p>
      ) : (
        <ul class="note-list">
          {notes.map((note) => (
            <li key={note.id} class="note-item" onClick={() => route(noteRoutes.edit.to(note.id))}>
              <div class="note-item__header">
                <span class="note-item__title">{note.title}</span>
                <div class="note-item__actions" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleDelete(note.id)} class="btn btn--danger">
                    削除
                  </button>
                </div>
              </div>
              <p class="note-item__content">{note.content}</p>
              <div class="note-item__meta">作成日時: {formatDateJa(note.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
