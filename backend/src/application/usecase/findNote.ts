import { NoteRepositoryImpl } from "../../infrastructure/repository/noteRepositoryImpl.js";
import type { Note } from "../../domain/model/note.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノート取得ユースケース
 */
export async function findNote(id: number): Promise<Result<Note>> {
  try {
    const note = await NoteRepositoryImpl.findById(id);
    if (!note) {
      return err("ノートが見つかりません");
    }
    return ok(note);
  } catch (e) {
    console.error("取得エラー:", e);
    return err("ノートの取得に失敗しました");
  }
}
