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

  pattern: (fieldLabel: string, regex: RegExp, errorMessage: string): ValidationRule => ({
    validate: (value) => regex.test(value),
    message: errorMessage.replace("{label}", fieldLabel),
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

/**
 * ルール定義（ユニオン型）
 */
export type RuleDefinition =
  | { type: "required" }
  | { type: "maxLength"; value: number }
  | { type: "pattern"; value: RegExp; message: string };

/**
 * フィールドスキーマ
 */
export interface FieldSchema {
  label: string;
  rules: readonly RuleDefinition[];
}

/**
 * バリデーションスキーマ（型安全）
 */
export type ValidationSchema<T> = {
  [K in keyof T]: FieldSchema;
};

/**
 * ルール定義からValidationRuleを生成
 */
const buildRulesFromDefinitions = (
  label: string,
  definitions: readonly RuleDefinition[]
): ValidationRule[] => {
  return definitions.map((def) => {
    switch (def.type) {
      case "required":
        return StringRules.required(label);
      case "maxLength":
        return StringRules.maxLength(label, def.value);
      case "pattern":
        return StringRules.pattern(label, def.value, def.message);
    }
  });
};

/**
 * スキーマからバリデータを生成
 */
export const createValidatorFromSchema = <
  T extends { [P in K]: string },
  K extends string = keyof T & string,
>(
  schema: ValidationSchema<T>
): ((input: T) => Result<T, ValidationError<K>[]>) => {
  const fields = Object.entries(schema).map(([field, config]) => ({
    field: field as K,
    rules: buildRulesFromDefinitions(
      (config as FieldSchema).label,
      (config as FieldSchema).rules
    ),
  }));

  return createValidator<T, K>(fields);
};
