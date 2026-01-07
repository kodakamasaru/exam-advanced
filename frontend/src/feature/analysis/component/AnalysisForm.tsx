/**
 * 分析フォームコンポーネント
 */

import { useState } from "preact/hooks";
import type { AnalysisFormField } from "../types";
import type { TouchedState } from "../../../type";
import { analysisValidator } from "../validation";

interface AnalysisFormProps {
  onSubmit: (title: string, text: string) => void;
  isSubmitting: boolean;
}

export function AnalysisForm({ onSubmit, isSubmitting }: AnalysisFormProps) {
  const [form, setForm] = useState({ title: "", text: "" });
  const [touched, setTouched] = useState<TouchedState<AnalysisFormField>>({
    title: false,
    text: false,
  });

  const handleChange = (field: AnalysisFormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: AnalysisFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setTouched({ title: true, text: true });

    const { isValid } = analysisValidator.validateForm(form);
    if (isValid) {
      onSubmit(form.title, form.text);
    }
  };

  const { errors } = analysisValidator.validateForm(form);
  const titleCount = analysisValidator.getCharacterCount("title", form.title);
  const textCount = analysisValidator.getCharacterCount("text", form.text);

  return (
    <form onSubmit={handleSubmit} class="form">
      <div class="form-group">
        <label for="title" class="form-label">
          タイトル（任意）
        </label>
        <input
          type="text"
          id="title"
          class={`form-input ${touched.title && errors.title ? "form-input--error" : ""}`}
          value={form.title}
          onInput={(e) => handleChange("title", e.currentTarget.value)}
          onBlur={() => handleBlur("title")}
          maxLength={30}
          placeholder="分析結果のタイトル"
        />
        <div class="form-hint">
          <span class={titleCount.isOver ? "text-error" : ""}>
            {titleCount.current}/{titleCount.max}
          </span>
        </div>
        {touched.title && errors.title && (
          <div class="form-error">{errors.title}</div>
        )}
      </div>

      <div class="form-group">
        <label for="text" class="form-label">
          本文 <span class="required">*</span>
        </label>
        <textarea
          id="text"
          class={`form-textarea ${touched.text && errors.text ? "form-textarea--error" : ""}`}
          value={form.text}
          onInput={(e) => handleChange("text", e.currentTarget.value)}
          onBlur={() => handleBlur("text")}
          maxLength={10000}
          rows={10}
          placeholder="英語の本文を入力してください"
        />
        <div class="form-hint">
          <span class={textCount.isOver ? "text-error" : ""}>
            {textCount.current}/{textCount.max}
          </span>
        </div>
        {touched.text && errors.text && (
          <div class="form-error">{errors.text}</div>
        )}
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn--primary"
          disabled={isSubmitting || !analysisValidator.validateForm(form).isValid}
        >
          {isSubmitting ? "分析中..." : "分析する"}
        </button>
      </div>
    </form>
  );
}
