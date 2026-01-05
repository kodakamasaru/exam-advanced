/**
 * バリデーションライブラリ
 */

import type { Result } from "./result.js";
import { ok, err } from "./result.js";

/**
 * バリデーションエラー
 */
export interface ValidationError<K extends string = string> {
  field: K;
  message: string;
}

/**
 * バリデーションルール
 */
interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

/**
 * 文字列フィールドのバリデーションルールビルダー
 */
export const StringRules = {
  required: (fieldLabel: string): ValidationRule => ({
    validate: (value) => value.trim() !== "",
    message: `${fieldLabel}は必須です`,
  }),

  maxLength: (fieldLabel: string, max: number): ValidationRule => ({
    validate: (value) => value.trim().length <= max,
    message: `${fieldLabel}は${max}文字以内で入力してください`,
  }),
};

/**
 * フィールドバリデーター（keyof Tで型安全）
 */
interface FieldValidator<K extends string> {
  field: K;
  rules: ValidationRule[];
}

/**
 * バリデーター作成
 * T: バリデーション対象の型
 * K: フィールド名のユニオン型
 */
export const createValidator = <
  T extends { [P in K]: string },
  K extends string
>(
  fields: FieldValidator<K>[]
): ((input: T) => Result<T, ValidationError<K>[]>) => {
  return (input: T): Result<T, ValidationError<K>[]> => {
    const errors: ValidationError<K>[] = [];

    for (const fieldValidator of fields) {
      const value = input[fieldValidator.field];

      for (const rule of fieldValidator.rules) {
        if (!rule.validate(value)) {
          errors.push({
            field: fieldValidator.field,
            message: rule.message,
          });
          break; // 1フィールドにつき最初のエラーのみ
        }
      }
    }

    if (errors.length > 0) {
      return err(errors);
    }

    return ok(input);
  };
};

/**
 * バリデーションエラーを文字列に変換
 */
export const formatValidationErrors = (errors: ValidationError[]): string => {
  const first = errors[0];
  if (first === undefined) {
    return "バリデーションエラー";
  }
  return first.message;
};
