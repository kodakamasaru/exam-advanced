/**
 * Note機能のアクション（FW非依存）
 */

import type { AppState, Note } from "./state";
import type { FieldName } from "../../types/validation";
import { validateField, validateForm } from "./validation";
import * as api from "./api";
import { ApiError } from "../../lib/api";
import { initialForm, initialFormErrors, initialFormTouched } from "./state";

/**
 * エラーメッセージを取得
 */
const getErrorMessage = (e: unknown): string => {
  return e instanceof ApiError ? e.message : "通信エラーが発生しました";
};

/**
 * フォームをリセット
 */
export const resetForm = (state: AppState): void => {
  state.form = { ...initialForm };
  state.formErrors = { ...initialFormErrors };
  state.formTouched = { ...initialFormTouched };
};

/**
 * フィールドをバリデート
 */
export const validateFormField = (state: AppState, field: FieldName): void => {
  state.formTouched[field] = true;
  state.formErrors[field] = validateField(field, state.form[field]);
};

/**
 * フォーム全体をバリデート
 */
export const validateFormAll = (state: AppState): boolean => {
  state.formTouched.title = true;
  state.formTouched.content = true;
  const result = validateForm(state.form);
  state.formErrors = result.errors;
  return result.isValid;
};

/**
 * ノート一覧を取得
 */
export const fetchNotes = async (state: AppState): Promise<void> => {
  try {
    state.notes = await api.fetchNotes();
  } catch (e) {
    state.error = getErrorMessage(e);
  }
};

/**
 * 編集用にフォームを初期化
 */
export const initEditForm = (state: AppState, note: Note): void => {
  state.form = {
    title: note.title,
    content: note.content,
  };
  state.formErrors = { ...initialFormErrors };
  state.formTouched = { ...initialFormTouched };
};

/**
 * ノートを作成
 */
export const createNote = async (
  state: AppState,
  onSuccess: () => void
): Promise<void> => {
  if (state.isLoading) return;
  if (!validateFormAll(state)) return;

  state.isLoading = true;
  state.error = "";
  state.success = "";

  try {
    await api.createNote(state.form);
    state.success = "ノートを作成しました";
    resetForm(state);
    await fetchNotes(state);
    onSuccess();
  } catch (e) {
    state.error = getErrorMessage(e);
  } finally {
    state.isLoading = false;
  }
};

/**
 * ノートを更新
 */
export const updateNote = async (
  state: AppState,
  noteId: number,
  onSuccess: () => void
): Promise<void> => {
  if (state.isLoading) return;
  if (!validateFormAll(state)) return;

  state.isLoading = true;
  state.error = "";
  state.success = "";

  try {
    await api.updateNote(noteId, state.form);
    state.success = "ノートを更新しました";
    resetForm(state);
    await fetchNotes(state);
    onSuccess();
  } catch (e) {
    state.error = getErrorMessage(e);
  } finally {
    state.isLoading = false;
  }
};

/**
 * ノートを削除
 */
export const deleteNote = async (state: AppState, id: number): Promise<void> => {
  if (state.isLoading) return;

  state.isLoading = true;
  state.error = "";
  state.success = "";

  try {
    await api.deleteNote(id);
    state.success = "ノートを削除しました";
    await fetchNotes(state);
  } catch (e) {
    state.error = getErrorMessage(e);
  } finally {
    state.isLoading = false;
  }
};
