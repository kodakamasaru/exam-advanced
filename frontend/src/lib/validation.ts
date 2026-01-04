/**
 * 共通バリデーションユーティリティ
 */

import type {
  FieldName,
  ValidationRule,
  ValidationResult,
  CharacterCount,
  ValidationErrors,
} from "../types/validation";

/**
 * バリデーションエラーメッセージ
 */
export const ValidationMessages = {
  required: (fieldName: string): string => `${fieldName}は必須です`,
  maxLength: (fieldName: string, max: number): string =>
    `${fieldName}は${max}文字以内で入力してください`,
};

/**
 * バリデーション関数を生成
 */
export function createValidator(
  rules: Record<FieldName, ValidationRule>,
  labels: Record<FieldName, string>
) {
  /**
   * 単一フィールドのバリデーション
   */
  function validateField(field: FieldName, value: string): string | null {
    const rule = rules[field];
    if (!rule) return null;

    const label = labels[field];
    const trimmedValue = value?.trim() ?? "";

    if (rule.required && trimmedValue === "") {
      return ValidationMessages.required(label);
    }

    if (rule.maxLength && trimmedValue.length > rule.maxLength) {
      return ValidationMessages.maxLength(label, rule.maxLength);
    }

    return null;
  }

  /**
   * フォーム全体のバリデーション
   */
  function validateForm(form: Record<FieldName, string>): ValidationResult {
    const errors: ValidationErrors = {
      title: validateField("title", form.title),
      content: validateField("content", form.content),
    };

    const isValid = errors.title === null && errors.content === null;

    return { isValid, errors };
  }

  /**
   * 文字数カウント情報を取得
   */
  function getCharacterCount(field: FieldName, value: string): CharacterCount {
    const rule = rules[field];
    const max = rule?.maxLength ?? 0;
    const current = (value ?? "").length;
    const remaining = max - current;

    return {
      current,
      max,
      remaining,
      isOver: remaining < 0,
    };
  }

  return {
    validateField,
    validateForm,
    getCharacterCount,
  };
}
