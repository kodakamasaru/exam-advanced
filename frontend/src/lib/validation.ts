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
 * バリデーションルールセット
 */
interface ValidationRuleSet {
  title: ValidationRule;
  content: ValidationRule;
}

/**
 * フィールドラベルセット
 */
interface FieldLabelSet {
  title: string;
  content: string;
}

/**
 * フォームデータ
 */
interface FormData {
  title: string;
  content: string;
}

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
export const createValidator = (
  rules: ValidationRuleSet,
  labels: FieldLabelSet
) => {
  /**
   * 単一フィールドのバリデーション
   */
  const validateField = (field: FieldName, value: string): string | null => {
    const rule = rules[field];
    const label = labels[field];
    const trimmedValue = value.trim();

    if (rule.required && trimmedValue === "") {
      return ValidationMessages.required(label);
    }

    if (rule.maxLength > 0 && trimmedValue.length > rule.maxLength) {
      return ValidationMessages.maxLength(label, rule.maxLength);
    }

    return null;
  };

  /**
   * フォーム全体のバリデーション
   */
  const validateForm = (form: FormData): ValidationResult => {
    const errors: ValidationErrors = {
      title: validateField("title", form.title),
      content: validateField("content", form.content),
    };

    const isValid = errors.title === null && errors.content === null;

    return { isValid, errors };
  };

  /**
   * 文字数カウント情報を取得
   */
  const getCharacterCount = (field: FieldName, value: string): CharacterCount => {
    const rule = rules[field];
    const max = rule.maxLength;
    const current = value.length;
    const remaining = max - current;

    return {
      current,
      max,
      remaining,
      isOver: remaining < 0,
    };
  };

  return {
    validateField,
    validateForm,
    getCharacterCount,
  };
};
