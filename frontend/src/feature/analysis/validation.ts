/**
 * 分析フォームのバリデーション設定
 */

import { createValidator } from "../../lib";
import type { FieldConfig } from "../../type";
import type { AnalysisFormField } from "./types";

/**
 * フィールド設定
 */
const fieldConfigs: Record<AnalysisFormField, FieldConfig> = {
  title: {
    label: "タイトル",
    maxLength: 30,
    required: false,
  },
  text: {
    label: "本文",
    maxLength: 100000,
    required: true,
  },
};

/**
 * 英語文章チェック（ASCII + よく使われる記号を許可）
 */
const validateEnglishText = (value: string): string | null => {
  if (!/^[\x00-\x7F•–—''""…©®™€£¥°±×÷]*$/.test(value)) {
    return "本文は英語の文章のみ入力してください";
  }
  return null;
};

/**
 * 基本バリデーター
 */
const baseValidator = createValidator<AnalysisFormField>(fieldConfigs);

/**
 * バリデーター（ASCII文字チェック追加）
 */
export const analysisValidator = {
  ...baseValidator,
  validateField: (field: AnalysisFormField, value: string): string | null => {
    const baseError = baseValidator.validateField(field, value);
    if (baseError) return baseError;

    if (field === "text" && value.trim() !== "") {
      return validateEnglishText(value);
    }
    return null;
  },
  validateForm: (
    form: Record<AnalysisFormField, string>
  ): { isValid: boolean; errors: Record<AnalysisFormField, string | null> } => {
    const baseResult = baseValidator.validateForm(form);

    if (baseResult.errors.text === null && form.text.trim() !== "") {
      baseResult.errors.text = validateEnglishText(form.text);
      if (baseResult.errors.text !== null) {
        baseResult.isValid = false;
      }
    }
    return baseResult;
  },
};
