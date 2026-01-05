import { Hono } from "hono";
import { NoteService } from "../service/noteService.js";
import type {
  NoteInput,
  NoteResponse,
  NotesResponse,
  DeleteResponse,
} from "../dto/note.js";
import type { ErrorResponse } from "../dto/common.js";
import { validateNoteInput } from "../middleware/noteValidator.js";
import { validate, getValidatedBody } from "../middleware/validation.js";
import { parseId, getParsedId } from "../middleware/parseId.js";

export const noteController = new Hono();

/**
 * ノート一覧取得
 * GET /api/notes
 */
noteController.get("/notes", async (ctx) => {
  const result = await NoteService.list();

  if (!result.ok) {
    return ctx.json<ErrorResponse>({ error: result.error }, 500);
  }

  return ctx.json<NotesResponse>({ notes: result.value });
});

/**
 * ノート作成
 * POST /api/notes
 */
noteController.post(
  "/notes",
  validate<NoteInput>(validateNoteInput),
  async (ctx) => {
    const body = getValidatedBody<NoteInput>(ctx);

    const result = await NoteService.create(body.title, body.content);

    if (!result.ok) {
      return ctx.json<ErrorResponse>({ error: result.error }, 500);
    }

    return ctx.json<NoteResponse>({ note: result.value }, 201);
  }
);

/**
 * ノート取得
 * GET /api/notes/:id
 */
noteController.get("/notes/:id", parseId(), async (ctx) => {
  const id = getParsedId(ctx);

  const result = await NoteService.find(id);
  if (!result.ok) {
    return ctx.json<ErrorResponse>({ error: result.error }, 404);
  }

  return ctx.json<NoteResponse>({ note: result.value });
});

/**
 * ノート更新
 * PUT /api/notes/:id
 */
noteController.put(
  "/notes/:id",
  parseId(),
  validate<NoteInput>(validateNoteInput),
  async (ctx) => {
    const id = getParsedId(ctx);
    const body = getValidatedBody<NoteInput>(ctx);

    const result = await NoteService.update(id, body.title, body.content);

    if (!result.ok) {
      return ctx.json<ErrorResponse>({ error: result.error }, 404);
    }

    return ctx.json<NoteResponse>({ note: result.value });
  }
);

/**
 * ノート削除
 * DELETE /api/notes/:id
 */
noteController.delete("/notes/:id", parseId(), async (ctx) => {
  const id = getParsedId(ctx);

  const result = await NoteService.delete(id);

  if (!result.ok) {
    return ctx.json<ErrorResponse>({ error: result.error }, 404);
  }

  return ctx.json<DeleteResponse>({ success: true });
});
