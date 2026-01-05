/**
 * ノートリクエスト/レスポンスDTO
 */

import type { Note } from "../entity/note.js";

/**
 * ノート入力（作成・更新共通）
 */
export interface NoteInput {
  title: string;
  content: string;
}

/**
 * ノート単体レスポンス
 */
export interface NoteResponse {
  note: Note;
}

/**
 * ノート一覧レスポンス
 */
export interface NotesResponse {
  notes: Note[];
}

/**
 * 削除成功レスポンス
 */
export interface DeleteResponse {
  success: boolean;
}
