/**
 * Note API
 */

import { get, post, put, del } from "../../lib/api";
import type { Note, NoteInput, NotesResponse, NoteResponse } from "./types.d";

/**
 * ノート一覧を取得
 */
export async function fetchNotes(): Promise<Note[]> {
  const data = await get<NotesResponse>("/notes");
  return data.notes;
}

/**
 * ノートを作成
 */
export async function createNote(input: NoteInput): Promise<Note> {
  const data = await post<NoteResponse, NoteInput>("/notes", {
    title: input.title.trim(),
    content: input.content.trim(),
  });
  return data.note;
}

/**
 * ノートを更新
 */
export async function updateNote(id: number, input: NoteInput): Promise<Note> {
  const data = await put<NoteResponse, NoteInput>(`/notes/${id}`, {
    title: input.title.trim(),
    content: input.content.trim(),
  });
  return data.note;
}

/**
 * ノートを削除
 */
export async function deleteNote(id: number): Promise<void> {
  await del<{ success: boolean }>(`/notes/${id}`);
}
