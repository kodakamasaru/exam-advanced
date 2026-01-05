import { eq } from "drizzle-orm";
import { db, notes } from "../db/index.js";
import type { Note } from "../entity/note.js";

/**
 * ノートリポジトリ
 */
export const NoteRepository = {
  /**
   * 全件取得
   */
  findAll: async (): Promise<Note[]> => {
    const result = await db.select().from(notes).orderBy(notes.id);
    return result;
  },

  /**
   * ID検索
   */
  findById: async (id: number): Promise<Note | null> => {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0] ?? null;
  },

  /**
   * 作成
   */
  create: async (title: string, content: string): Promise<Note | null> => {
    const result = await db
      .insert(notes)
      .values({
        title: title.trim(),
        content: content.trim(),
      })
      .returning();

    return result[0] ?? null;
  },

  /**
   * 更新
   */
  update: async (
    id: number,
    title: string,
    content: string
  ): Promise<Note | null> => {
    const result = await db
      .update(notes)
      .set({
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();

    return result[0] ?? null;
  },

  /**
   * 削除
   */
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result.length > 0;
  },
};
