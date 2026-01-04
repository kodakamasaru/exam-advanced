import { Hono } from "hono";
import {
  listNotes,
  createNote,
  findNote,
  updateNote,
  deleteNote,
} from "../application/usecase/index.js";
import { parseNoteJsonData, parseId } from "../shared/parseFormData.js";

export const noteController = new Hono();

/**
 * ノート一覧取得
 * GET /api/notes
 */
noteController.get("/notes", async (ctx) => {
  const result = await listNotes();

  if (!result.ok) {
    return ctx.json({ error: result.error }, 500);
  }

  return ctx.json({ notes: result.value });
});

/**
 * ノート作成
 * POST /api/notes
 */
noteController.post("/notes", async (ctx) => {
  const body = await ctx.req.json();
  const formData = parseNoteJsonData(body);

  const result = await createNote({
    title: formData.title,
    content: formData.content,
  });

  if (!result.ok) {
    return ctx.json({ error: result.error }, 422);
  }

  return ctx.json({ note: result.value }, 201);
});

/**
 * ノート取得
 * GET /api/notes/:id
 */
noteController.get("/notes/:id", async (ctx) => {
  const idResult = parseId(ctx.req.param("id") || "");
  if (!idResult.ok) {
    return ctx.json({ error: idResult.error }, 400);
  }

  const result = await findNote(idResult.value);
  if (!result.ok) {
    return ctx.json({ error: result.error }, 404);
  }

  return ctx.json({ note: result.value });
});

/**
 * ノート更新
 * PUT /api/notes/:id
 */
noteController.put("/notes/:id", async (ctx) => {
  const idResult = parseId(ctx.req.param("id") || "");
  if (!idResult.ok) {
    return ctx.json({ error: idResult.error }, 400);
  }

  const body = await ctx.req.json();
  const formData = parseNoteJsonData(body);

  const result = await updateNote(idResult.value, formData);

  if (!result.ok) {
    return ctx.json({ error: result.error }, 422);
  }

  return ctx.json({ note: result.value });
});

/**
 * ノート削除
 * DELETE /api/notes/:id
 */
noteController.delete("/notes/:id", async (ctx) => {
  const idResult = parseId(ctx.req.param("id") || "");
  if (!idResult.ok) {
    return ctx.json({ error: idResult.error }, 400);
  }

  const result = await deleteNote(idResult.value);

  if (!result.ok) {
    return ctx.json({ error: result.error }, 404);
  }

  return ctx.json({ success: true });
});
