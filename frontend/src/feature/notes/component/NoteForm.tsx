/**
 * ノートフォームコンポーネント
 */

import { useState } from "preact/hooks";
import { validateForm, validateField, getCharacterCount, NoteFieldName } from "../validation";
import type { TouchedState } from "../../../type/validation";

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  submitLabel: string;
  loadingLabel: string;
  onSubmit: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

export function NoteForm({
  initialTitle = "",
  initialContent = "",
  submitLabel,
  loadingLabel,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [errors, setErrors] = useState<Record<NoteFieldName, string | null>>({ title: null, content: null });
  const [touched, setTouched] = useState<TouchedState<NoteFieldName>>({ title: false, content: false });
  const [isLoading, setIsLoading] = useState(false);

  const validation = validateForm({ title, content });
  const titleCount = getCharacterCount("title", title);
  const contentCount = getCharacterCount("content", content);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setTouched({ title: true, content: true });

    const result = validateForm({ title, content });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsLoading(true);
    await onSubmit(title, content);
    setIsLoading(false);
  };

  const handleBlur = (field: NoteFieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, field === "title" ? title : content);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const getCounterClass = (isOver: boolean, remaining: number, warnThreshold: number) => {
    if (isOver) return "form-group__counter form-group__counter--error";
    if (remaining <= warnThreshold) return "form-group__counter form-group__counter--warning";
    return "form-group__counter";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="form-group">
        <label for="title" class="form-group__label">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onInput={(e) => setTitle(e.currentTarget.value)}
          onBlur={() => handleBlur("title")}
          class={`form-group__input ${touched.title && errors.title ? "form-group__input--error" : ""}`}
          placeholder="ノートのタイトル"
        />
        <div class="form-group__footer">
          {touched.title && errors.title && (
            <span class="form-group__error">{errors.title}</span>
          )}
          <span class={getCounterClass(titleCount.isOver, titleCount.remaining, 10)}>
            {titleCount.current} / {titleCount.max}
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="content" class="form-group__label">
          内容
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onInput={(e) => setContent(e.currentTarget.value)}
          onBlur={() => handleBlur("content")}
          class={`form-group__textarea ${touched.content && errors.content ? "form-group__textarea--error" : ""}`}
          placeholder="ノートの内容"
        />
        <div class="form-group__footer">
          {touched.content && errors.content && (
            <span class="form-group__error">{errors.content}</span>
          )}
          <span class={getCounterClass(contentCount.isOver, contentCount.remaining, 50)}>
            {contentCount.current} / {contentCount.max}
          </span>
        </div>
      </div>

      <div class="button-group">
        <button
          type="submit"
          disabled={isLoading || !validation.isValid}
          class="btn btn--primary"
        >
          {isLoading ? loadingLabel : submitLabel}
        </button>
        <button type="button" onClick={onCancel} class="btn btn--cancel">
          キャンセル
        </button>
      </div>
    </form>
  );
}
