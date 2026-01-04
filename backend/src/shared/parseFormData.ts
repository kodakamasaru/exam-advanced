import type { Result } from "./result.js";
import { ok, err } from "./result.js";

/**
 * ノート用JSONデータの型
 */
interface NoteJsonData {
  title: string;
  content: string;
}

/**
 * JSONデータのパース（ノート用）
 */
export function parseNoteJsonData(body: unknown): NoteJsonData {
  if (typeof body !== "object" || body === null) {
    return { title: "", content: "" };
  }

  const data = body as Record<string, unknown>;

  return {
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
  };
}

/**
 * IDのパース
 */
export function parseId(param: string): Result<number> {
  const id = parseInt(param, 10);
  if (isNaN(id) || id <= 0) {
    return err("IDは正の整数で指定してください");
  }
  return ok(id);
}
