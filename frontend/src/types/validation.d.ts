/**
 * バリデーション関連の型定義
 */

export type FieldName = "title" | "content";

export interface ValidationErrors {
  title: string | null;
  content: string | null;
}

export interface TouchedState {
  title: boolean;
  content: boolean;
}

export interface CharacterCount {
  current: number;
  max: number;
  remaining: number;
  isOver: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface ValidationRule {
  maxLength: number;
  required: boolean;
}
