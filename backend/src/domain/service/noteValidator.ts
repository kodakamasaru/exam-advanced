import type { CreateNoteInput, UpdateNoteInput } from "../model/note.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノートバリデーションサービス
 */
export const NoteValidator = {
  /**
   * 作成入力のバリデーション
   */
  validateCreateInput(input: CreateNoteInput): Result<CreateNoteInput> {
    if (!input.title || input.title.trim() === "") {
      return err("タイトルは必須です");
    }
    if (input.title.length > 30) {
      return err("タイトルは30文字以内で入力してください");
    }
    if (!input.content || input.content.trim() === "") {
      return err("内容は必須です");
    }
    if (input.content.length > 200) {
      return err("内容は200文字以内で入力してください");
    }
    return ok({
      title: input.title.trim(),
      content: input.content.trim(),
    });
  },

  /**
   * 更新入力のバリデーション
   */
  validateUpdateInput(input: UpdateNoteInput): Result<UpdateNoteInput> {
    return this.validateCreateInput(input);
  },
};
