/**
 * ノートエンティティ
 */
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * タグエンティティ
 */
export interface Tag {
  id: number;
  name: string;
  createdAt: Date;
}

/**
 * ノート作成時の入力
 */
export interface CreateNoteInput {
  title: string;
  content: string;
}

/**
 * ノート更新時の入力
 */
export interface UpdateNoteInput {
  title: string;
  content: string;
}
