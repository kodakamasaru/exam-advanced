/**
 * ノートバリデーター
 */

import { createValidator, StringRules } from "../lib/validator.js";
import type { NoteInput } from "../dto/note.js";

/**
 * ノートバリデーター
 */
export const validateNoteInput = createValidator<NoteInput, keyof NoteInput>([
  {
    field: "title",
    rules: [
      StringRules.required("タイトル"),
      StringRules.maxLength("タイトル", 30),
    ],
  },
  {
    field: "content",
    rules: [
      StringRules.required("内容"),
      StringRules.maxLength("内容", 200),
    ],
  },
]);
