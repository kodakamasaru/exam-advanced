import { NoteRepositoryImpl } from "../../infrastructure/repository/noteRepositoryImpl.js";
import { NoteValidator } from "../../domain/service/noteValidator.js";
import type { Note, UpdateNoteInput } from "../../domain/model/note.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノート更新ユースケース
 */
export async function updateNote(
  id: number,
  input: UpdateNoteInput
): Promise<Result<Note>> {
  // バリデーション
  const validation = NoteValidator.validateUpdateInput(input);
  if (!validation.ok) {
    return validation;
  }

  try {
    const note = await NoteRepositoryImpl.update(id, validation.value);
    if (!note) {
      return err("ノートが見つかりません");
    }
    return ok(note);
  } catch (e) {
    console.error("更新エラー:", e);
    return err("更新に失敗しました");
  }
}
