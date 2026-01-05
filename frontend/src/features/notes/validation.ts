/**
 * Note機能のバリデーション
 */

import type { ValidationRule } from "../../types/validation";
import { createValidator } from "../../lib/validation";

/**
 * ノートのバリデーションルール型
 */
interface NoteValidationRuleSet {
  title: ValidationRule;
  content: ValidationRule;
}

/**
 * ノートのフィールドラベル型
 */
interface NoteFieldLabelSet {
  title: string;
  content: string;
}

/**
 * ノートのバリデーションルール
 */
const NoteValidationRules: NoteValidationRuleSet = {
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
const NoteFieldLabels: NoteFieldLabelSet = {
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
