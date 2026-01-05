import { NoteRepository } from "../repository/noteRepository.js";
import type { Note } from "../entity/note.js";
import type { Result } from "../lib/result.js";
import { ok, err } from "../lib/result.js";

/**
 * バリデーション
 */
const validateInput = (
  title: string,
  content: string
): Result<{ title: string; content: string }> => {
  if (!title || title.trim() === "") {
    return err("タイトルは必須です");
  }
  if (title.length > 30) {
    return err("タイトルは30文字以内で入力してください");
  }
  if (!content || content.trim() === "") {
    return err("内容は必須です");
  }
  if (content.length > 200) {
    return err("内容は200文字以内で入力してください");
  }
  return ok({
    title: title.trim(),
    content: content.trim(),
  });
};

/**
 * ノートサービス
 */
export const NoteService = {
  /**
   * ノート一覧取得
   */
  list: async (): Promise<Result<Note[]>> => {
    try {
      const notes = await NoteRepository.findAll();
      return ok(notes);
    } catch (e) {
      console.error("一覧取得エラー:", e);
      return err("ノート一覧の取得に失敗しました");
    }
  },

  /**
   * ノート取得
   */
  find: async (id: number): Promise<Result<Note>> => {
    try {
      const note = await NoteRepository.findById(id);
      if (!note) {
        return err("ノートが見つかりません");
      }
      return ok(note);
    } catch (e) {
      console.error("取得エラー:", e);
      return err("ノートの取得に失敗しました");
    }
  },

  /**
   * ノート作成
   */
  create: async (title: string, content: string): Promise<Result<Note>> => {
    const validation = validateInput(title, content);
    if (!validation.ok) {
      return validation;
    }

    try {
      const note = await NoteRepository.create(
        validation.value.title,
        validation.value.content
      );
      if (!note) {
        return err("ノートの作成に失敗しました");
      }
      return ok(note);
    } catch (e) {
      console.error("作成エラー:", e);
      return err("ノートの作成に失敗しました");
    }
  },

  /**
   * ノート更新
   */
  update: async (
    id: number,
    title: string,
    content: string
  ): Promise<Result<Note>> => {
    const validation = validateInput(title, content);
    if (!validation.ok) {
      return validation;
    }

    try {
      const note = await NoteRepository.update(
        id,
        validation.value.title,
        validation.value.content
      );
      if (!note) {
        return err("ノートが見つかりません");
      }
      return ok(note);
    } catch (e) {
      console.error("更新エラー:", e);
      return err("更新に失敗しました");
    }
  },

  /**
   * ノート削除
   */
  delete: async (id: number): Promise<Result<boolean>> => {
    try {
      const deleted = await NoteRepository.delete(id);
      if (!deleted) {
        return err("ノートが見つかりません");
      }
      return ok(true);
    } catch (e) {
      console.error("削除エラー:", e);
      return err("削除に失敗しました");
    }
  },
};
