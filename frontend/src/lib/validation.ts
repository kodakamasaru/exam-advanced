/**
 * 共通バリデーションユーティリティ（汎用）
 */

import type {
  FieldConfig,
  ValidationResult,
  CharacterCount,
} from "../type/validation";
import { ValidationMessages } from "../type/validation";

/**
 * バリデーション関数を生成（ジェネリック）
 *
 * @param fields - フィールド名をキーとした設定
 * @returns バリデーション関数群
 */
export const createValidator = <T extends string>(
  fields: Record<T, FieldConfig>
) => {
  /**
   * 単一フィールドのバリデーション
   */
  const validateField = (field: T, value: string): string | null => {
    const config = fields[field];
    const trimmedValue = value.trim();

    if (config.required && trimmedValue === "") {
      return ValidationMessages.required(config.label);
    }

    if (config.maxLength > 0 && trimmedValue.length > config.maxLength) {
      return ValidationMessages.maxLength(config.label, config.maxLength);
    }

    return null;
  };

  /**
   * フォーム全体のバリデーション
   */
  const validateForm = (form: Record<T, string>): ValidationResult<T> => {
    const fieldNames = Object.keys(fields) as T[];
    const errors = {} as Record<T, string | null>;

    for (const field of fieldNames) {
      errors[field] = validateField(field, form[field]);
    }

    const isValid = Object.values(errors).every((error) => error === null);

    return { isValid, errors };
  };

  /**
   * 文字数カウント情報を取得
   */
  const getCharacterCount = (field: T, value: string): CharacterCount => {
    const config = fields[field];
    const max = config.maxLength;
    const current = value.length;
    const remaining = max - current;

    return {
      current,
      max,
      remaining,
      isOver: remaining < 0,
    };
  };

  /**
   * フィールド設定を取得
   */
  const getFieldConfig = (field: T): FieldConfig => fields[field];

  return {
    validateField,
    validateForm,
    getCharacterCount,
    getFieldConfig,
  };
};
