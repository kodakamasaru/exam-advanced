import type { Note, CreateNoteInput, UpdateNoteInput } from "../../domain/model/note.js";

/**
 * ノートリポジトリインターフェース
 */
export interface INoteRepository {
  /**
   * 全件取得
   */
  findAll(): Promise<Note[]>;

  /**
   * ID検索
   */
  findById(id: number): Promise<Note | null>;

  /**
   * 作成
   */
  create(input: CreateNoteInput): Promise<Note | null>;

  /**
   * 更新
   */
  update(id: number, input: UpdateNoteInput): Promise<Note | null>;

  /**
   * 削除
   */
  delete(id: number): Promise<boolean>;
}
