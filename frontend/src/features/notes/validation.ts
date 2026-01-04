/**
 * Note機能のバリデーション
 */

import type { FieldName, ValidationRule } from "../../types/validation";
import { createValidator } from "../../lib/validation";

/**
 * ノートのバリデーションルール
 */
const NoteValidationRules: Record<FieldName, ValidationRule> = {
  title: {
    maxLength: 30,
    required: true,
  },
  content: {
    maxLength: 200,
    required: true,
  },
};

/**
 * フィールド名の日本語マッピング
 */
const NoteFieldLabels: Record<FieldName, string> = {
  title: "タイトル",
  content: "内容",
};

/**
 * ノート用バリデータ
 */
export const noteValidator = createValidator(
  NoteValidationRules,
  NoteFieldLabels
);

export const { validateField, validateForm, getCharacterCount } = noteValidator;
