import { NoteRepositoryImpl } from "../../infrastructure/repository/noteRepositoryImpl.js";
import type { Result } from "../../shared/result.js";
import { ok, err } from "../../shared/result.js";

/**
 * ノート削除ユースケース
 */
export async function deleteNote(id: number): Promise<Result<boolean>> {
  try {
    const deleted = await NoteRepositoryImpl.delete(id);
    if (!deleted) {
      return err("ノートが見つかりません");
    }
    return ok(true);
  } catch (e) {
    console.error("削除エラー:", e);
    return err("削除に失敗しました");
  }
}
