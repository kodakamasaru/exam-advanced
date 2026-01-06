/**
 * Note機能のバリデーション
 */

import type { FieldConfig } from "../../type/validation";
import { createValidator } from "../../lib/validation";

/**
 * ノートのフィールド名
 */
export type NoteFieldName = "title" | "content";

/**
 * ノートのフィールド設定
 */
const NoteFields: Record<NoteFieldName, FieldConfig> = {
  title: {
    label: "タイトル",
    maxLength: 30,
    required: true,
  },
  content: {
    label: "内容",
    maxLength: 200,
    required: true,
  },
};

/**
 * ノート用バリデータ
 */
export const noteValidator = createValidator<NoteFieldName>(NoteFields);

export const { validateField, validateForm, getCharacterCount } = noteValidator;
