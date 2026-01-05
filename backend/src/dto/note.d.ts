/**
 * ノート作成リクエスト
 */
export interface CreateNoteRequest {
  title: string;
  content: string;
}

/**
 * ノート更新リクエスト
 */
export interface UpdateNoteRequest {
  title: string;
  content: string;
}

/**
 * ノートレスポンス
 */
export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ノート一覧レスポンス
 */
export interface NotesListResponse {
  notes: NoteResponse[];
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  error: string;
}
