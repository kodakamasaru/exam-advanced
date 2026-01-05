import { eq } from "drizzle-orm";
import { db, notes } from "../db/index.js";
import type { Note } from "../entity/note.js";
import type { Result } from "../lib/result.js";
import { ok, err } from "../lib/result.js";

/**
 * ノートリポジトリ
 */
export const NoteRepository = {
  /**
   * 全件取得
   */
  findAll: async (): Promise<Result<Note[]>> => {
    try {
      const result = await db.query.notes.findMany({
        orderBy: (notes, { asc }) => [asc(notes.id)],
      });
      return ok(result);
    } catch (e) {
      console.error("Repository findAll error:", e);
      return err("データベースからの取得に失敗しました");
    }
  },

  /**
   * ID検索
   */
  findById: async (id: number): Promise<Result<Note | null>> => {
    try {
      const result = await db.query.notes.findFirst({
        where: eq(notes.id, id),
      });
      return ok(result ?? null);
    } catch (e) {
      console.error("Repository findById error:", e);
      return err("データベースからの取得に失敗しました");
    }
  },

  /**
   * 作成
   */
  create: async (title: string, content: string): Promise<Result<Note>> => {
    try {
      const result = await db
        .insert(notes)
        .values({ title, content })
        .returning();

      const first = result[0];
      if (first === undefined) {
        return err("ノートの作成に失敗しました");
      }
      return ok(first);
    } catch (e) {
      console.error("Repository create error:", e);
      return err("データベースへの保存に失敗しました");
    }
  },

  /**
   * 更新
   */
  update: async (
    id: number,
    title: string,
    content: string
  ): Promise<Result<Note | null>> => {
    try {
      const result = await db
        .update(notes)
        .set({
          title,
          content,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning();

      const first = result[0];
      return ok(first ?? null);
    } catch (e) {
      console.error("Repository update error:", e);
      return err("データベースの更新に失敗しました");
    }
  },

  /**
   * 削除
   */
  delete: async (id: number): Promise<Result<boolean>> => {
    try {
      const result = await db.delete(notes).where(eq(notes.id, id)).returning();
      return ok(result.length > 0);
    } catch (e) {
      console.error("Repository delete error:", e);
      return err("データベースからの削除に失敗しました");
    }
  },
};
