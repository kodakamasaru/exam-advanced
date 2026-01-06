/**
 * バリデーション関連の型定義（汎用）
 */

/**
 * フィールド定義（ルール + ラベル）
 */
export interface FieldConfig {
  label: string;
  maxLength: number;
  required: boolean;
}

/**
 * 文字数カウント情報
 */
export interface CharacterCount {
  current: number;
  max: number;
  remaining: number;
  isOver: boolean;
}

/**
 * バリデーション結果（ジェネリック）
 */
export interface ValidationResult<T extends string> {
  isValid: boolean;
  errors: Record<T, string | null>;
}

/**
 * タッチ状態（ジェネリック）
 */
export type TouchedState<T extends string> = Record<T, boolean>;

/**
 * バリデーションエラーメッセージ生成関数
 */
export const ValidationMessages = {
  required: (label: string): string => `${label}は必須です`,
  maxLength: (label: string, max: number): string =>
    `${label}は${max}文字以内で入力してください`,
};
