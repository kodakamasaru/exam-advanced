import { NoteRepositoryImpl } from "../../infrastructure/repository/noteRepositoryImpl.js";
import type { Note } from "../../domain/model/note.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノート一覧取得ユースケース
 */
export async function listNotes(): Promise<Result<Note[]>> {
  try {
    const notes = await NoteRepositoryImpl.findAll();
    return ok(notes);
  } catch (e) {
    console.error("一覧取得エラー:", e);
    return err("ノート一覧の取得に失敗しました");
  }
}
