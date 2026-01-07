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
    maxLength: 10000,
    required: true,
  },
};

/**
 * バリデーター
 */
const baseValidator = createValidator<AnalysisFormField>(fieldConfigs);

/**
 * 英語チェック用バリデーション
 */
const validateEnglishOnly = (value: string): string | null => {
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    return "本文は英語とスペースのみで入力してください";
  }
  return null;
};

/**
 * カスタムバリデーション（英語チェック追加）
 */
export const analysisValidator = {
  ...baseValidator,
  validateField: (field: AnalysisFormField, value: string): string | null => {
    // 基本バリデーション
    const baseError = baseValidator.validateField(field, value);
    if (baseError) return baseError;

    // textフィールドの場合、英語チェック
    if (field === "text" && value.trim() !== "") {
      return validateEnglishOnly(value);
    }

    return null;
  },
  validateForm: (
    form: Record<AnalysisFormField, string>
  ): { isValid: boolean; errors: Record<AnalysisFormField, string | null> } => {
    const baseResult = baseValidator.validateForm(form);

    // textの英語チェックを追加
    if (baseResult.errors.text === null && form.text.trim() !== "") {
      baseResult.errors.text = validateEnglishOnly(form.text);
      if (baseResult.errors.text !== null) {
        baseResult.isValid = false;
      }
    }

    return baseResult;
  },
};
