import { Hono } from "hono";
import { NoteService } from "../service/noteService.js";
import type { Result } from "../lib/result.js";
import { ok, err } from "../lib/result.js";
import type { CreateNoteRequest } from "../dto/note.js";

export const noteController = new Hono();

/**
 * IDのパース
 */
const parseId = (param: string): Result<number> => {
  const id = parseInt(param, 10);
  if (isNaN(id) || id <= 0) {
    return err("IDは正の整数で指定してください");
  }
  return ok(id);
};

/**
 * JSONデータのパース
 */
const parseNoteJsonData = (body: unknown): CreateNoteRequest => {
  if (typeof body !== "object" || body === null) {
    return { title: "", content: "" };
  }

  const data = body as Record<string, unknown>;

  return {
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
  };
};

/**
 * ノート一覧取得
 * GET /api/notes
 */
noteController.get("/notes", async (ctx) => {
  const result = await NoteService.list();

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

  const result = await NoteService.create(formData.title, formData.content);

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

  const result = await NoteService.find(idResult.value);
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

  const result = await NoteService.update(
    idResult.value,
    formData.title,
    formData.content
  );

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

  const result = await NoteService.delete(idResult.value);

  if (!result.ok) {
    return ctx.json({ error: result.error }, 404);
  }

  return ctx.json({ success: true });
});
