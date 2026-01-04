/**
 * Note機能の状態定義（FW非依存）
 */

import type { Note, NoteInput } from "./types.d";
import type { ValidationErrors, TouchedState } from "../../types/validation";
import type { Route } from "../../lib/router";

// re-export for convenience
export type { Note };

/**
 * アプリケーション状態の型
 */
export interface AppState {
  currentRoute: Route;
  editingNoteId: number | null;
  notes: Note[];
  error: string;
  success: string;
  isLoading: boolean;
  form: NoteInput;
  formErrors: ValidationErrors;
  formTouched: TouchedState;
}

/**
 * フォームの初期状態
 */
export const initialForm: NoteInput = {
  title: "",
  content: "",
};

/**
 * バリデーションエラーの初期状態
 */
export const initialFormErrors: ValidationErrors = {
  title: null,
  content: null,
};

/**
 * タッチ状態の初期状態
 */
export const initialFormTouched: TouchedState = {
  title: false,
  content: false,
};

/**
 * アプリケーション状態の初期値
 */
export const initialState: AppState = {
  currentRoute: "list",
  editingNoteId: null,
  notes: [],
  error: "",
  success: "",
  isLoading: false,
  form: { ...initialForm },
  formErrors: { ...initialFormErrors },
  formTouched: { ...initialFormTouched },
};
