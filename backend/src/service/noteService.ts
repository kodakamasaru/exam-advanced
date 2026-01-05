import { NoteRepository } from "../repository/noteRepository.js";
import type { Note } from "../entity/note.js";
import type { Result } from "../lib/result.js";
import { ok, err } from "../lib/result.js";

/**
 * ノートサービス
 * バリデーション済みのデータを受け取る前提
 */
export const NoteService = {
  /**
   * ノート一覧取得
   */
  list: async (): Promise<Result<Note[]>> => {
    return NoteRepository.findAll();
  },

  /**
   * ノート取得
   */
  find: async (id: number): Promise<Result<Note>> => {
    const result = await NoteRepository.findById(id);
    if (!result.ok) {
      return result;
    }
    if (result.value === null) {
      return err("ノートが見つかりません");
    }
    return ok(result.value);
  },

  /**
   * ノート作成
   */
  create: async (title: string, content: string): Promise<Result<Note>> => {
    return NoteRepository.create(title.trim(), content.trim());
  },

  /**
   * ノート更新
   */
  update: async (
    id: number,
    title: string,
    content: string
  ): Promise<Result<Note>> => {
    const result = await NoteRepository.update(id, title.trim(), content.trim());
    if (!result.ok) {
      return result;
    }
    if (result.value === null) {
      return err("ノートが見つかりません");
    }
    return ok(result.value);
  },

  /**
   * ノート削除
   */
  delete: async (id: number): Promise<Result<boolean>> => {
    const result = await NoteRepository.delete(id);
    if (!result.ok) {
      return result;
    }
    if (!result.value) {
      return err("ノートが見つかりません");
    }
    return ok(true);
  },
};
