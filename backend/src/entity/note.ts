/**
 * ノートエンティティ（内部データモデル）
 */
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
