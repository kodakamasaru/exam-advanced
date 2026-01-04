import { eq } from "drizzle-orm";
import { db, notes } from "../database/index.js";
import type { Note, CreateNoteInput, UpdateNoteInput } from "../../domain/model/note.js";
import type { INoteRepository } from "../../application/interface/noteRepository.js";

/**
 * ノートリポジトリ実装（Drizzle ORM）
 */
export const NoteRepositoryImpl: INoteRepository = {
  /**
   * 全件取得
   */
  async findAll(): Promise<Note[]> {
    const result = await db.select().from(notes).orderBy(notes.id);
    return result;
  },

  /**
   * ID検索
   */
  async findById(id: number): Promise<Note | null> {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0] ?? null;
  },

  /**
   * 作成
   */
  async create(input: CreateNoteInput): Promise<Note | null> {
    const result = await db
      .insert(notes)
      .values({
        title: input.title.trim(),
        content: input.content.trim(),
      })
      .returning();

    return result[0] ?? null;
  },

  /**
   * 更新
   */
  async update(id: number, input: UpdateNoteInput): Promise<Note | null> {
    const result = await db
      .update(notes)
      .set({
        title: input.title.trim(),
        content: input.content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();

    return result[0] ?? null;
  },

  /**
   * 削除
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result.length > 0;
  },
};
