import { NoteRepositoryImpl } from "../../infrastructure/repository/noteRepositoryImpl.js";
import { NoteValidator } from "../../domain/service/noteValidator.js";
import type { Note, CreateNoteInput } from "../../domain/model/note.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノート作成ユースケース
 */
export async function createNote(input: CreateNoteInput): Promise<Result<Note>> {
  // バリデーション
  const validation = NoteValidator.validateCreateInput(input);
  if (!validation.ok) {
    return validation;
  }

  try {
    const note = await NoteRepositoryImpl.create(validation.value);
    if (!note) {
      return err("ノートの作成に失敗しました");
    }
    return ok(note);
  } catch (e) {
    console.error("作成エラー:", e);
    return err("ノートの作成に失敗しました");
  }
}
