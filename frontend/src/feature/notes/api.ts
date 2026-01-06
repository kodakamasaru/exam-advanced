/**
 * Note API
 */

import { get, post, put, del, ApiError } from "../../lib/api";
import type { Note, NoteInput, NotesResponse, NoteResponse } from "./types";

/**
 * API結果型（エラーハンドリング用）
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * リクエストをResult型でラップ
 */
const wrapRequest = async <T>(request: () => Promise<T>): Promise<ApiResult<T>> => {
  try {
    const data = await request();
    return { ok: true, data };
  } catch (e) {
    if (e instanceof ApiError) {
      return { ok: false, error: e.message };
    }
    return { ok: false, error: "通信エラーが発生しました" };
  }
};

/**
 * ノート一覧を取得
 */
export const fetchNotes = async (): Promise<Note[]> => {
  const data = await get<NotesResponse>("/notes");
  return data.notes;
};

/**
 * ノートを作成
 */
export const createNote = async (input: NoteInput): Promise<Note> => {
  const data = await post<NoteResponse, NoteInput>("/notes", {
    title: input.title.trim(),
    content: input.content.trim(),
  });
  return data.note;
};

/**
 * ノートを更新
 */
export const updateNote = async (id: number, input: NoteInput): Promise<Note> => {
  const data = await put<NoteResponse, NoteInput>(`/notes/${id}`, {
    title: input.title.trim(),
    content: input.content.trim(),
  });
  return data.note;
};

/**
 * ノートを削除
 */
export const deleteNote = async (id: number): Promise<void> => {
  await del<{ success: boolean }>(`/notes/${id}`);
};

/**
 * ノート取得（単一）
 */
export const findNote = async (id: number): Promise<Note> => {
  const data = await get<NoteResponse>(`/notes/${id}`);
  return data.note;
};

/**
 * ノートAPI（Result型でラップ）
 */
export const noteApi = {
  list: (): Promise<ApiResult<Note[]>> => wrapRequest(fetchNotes),
  find: (id: number): Promise<ApiResult<Note>> => wrapRequest(() => findNote(id)),
  create: (input: NoteInput): Promise<ApiResult<Note>> => wrapRequest(() => createNote(input)),
  update: (id: number, input: NoteInput): Promise<ApiResult<Note>> => wrapRequest(() => updateNote(id, input)),
  delete: (id: number): Promise<ApiResult<void>> => wrapRequest(() => deleteNote(id)),
};
