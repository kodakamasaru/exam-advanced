/**
 * Notes機能 - Alpine.js アプリケーション（FW依存部分）
 */

import type { AppState, Note } from "./state";
import type { FieldName, CharacterCount } from "../../types/validation";
import { initialState } from "./state";
import * as actions from "./actions";
import { getCharacterCount, validateForm } from "./validation";
import { parseRoute, navigateTo, onRouteChange } from "../../lib/router";
import { formatDateJa } from "../../lib/date";

/**
 * Alpine.jsコンポーネントの型定義
 */
interface NoteAppComponent extends AppState {
  init(): Promise<void>;
  handleRouteChange(): Promise<void>;
  navigateToList(): void;
  navigateToCreate(): void;
  navigateToEdit(noteId: number): void;
  formatDate(dateString: string): string;
  validateField(field: FieldName): void;
  getCharCount(field: FieldName): CharacterCount;
  readonly isFormValid: boolean;
  readonly editingNote: Note | null;
  createNote(): Promise<void>;
  updateNote(): Promise<void>;
  deleteNote(id: number): Promise<void>;
}

/**
 * ノートを検索するヘルパー関数
 */
const findNoteById = (notes: Note[], id: number): Note | null => {
  const found = notes.find((n) => n.id === id);
  return found !== undefined ? found : null;
};

/**
 * Alpine.js用のアプリケーション定義
 */
export const noteApp = (): NoteAppComponent => {
  const component: NoteAppComponent = {
    // 状態（state.tsから初期値を取得）
    ...initialState,

    /**
     * 初期化
     */
    async init(): Promise<void> {
      await actions.fetchNotes(component);
      await component.handleRouteChange();
      onRouteChange(() => component.handleRouteChange());
    },

    /**
     * ルート変更ハンドラ
     */
    async handleRouteChange(): Promise<void> {
      const { currentRoute, editingNoteId } = parseRoute();
      component.currentRoute = currentRoute;
      component.editingNoteId = editingNoteId;
      component.error = "";
      component.success = "";

      if (currentRoute === "edit" && editingNoteId !== null) {
        const note = findNoteById(component.notes, editingNoteId);
        if (note !== null) {
          actions.initEditForm(component, note);
        } else {
          component.error = "ノートが見つかりません";
          navigateTo("list");
        }
      }

      if (currentRoute === "create") {
        actions.resetForm(component);
      }
    },

    // ナビゲーション
    navigateToList: () => navigateTo("list"),
    navigateToCreate: () => navigateTo("create"),
    navigateToEdit: (noteId: number) => navigateTo("edit", noteId),

    formatDate: formatDateJa,

    // バリデーション
    validateField(field: FieldName): void {
      actions.validateFormField(component, field);
    },

    getCharCount(field: FieldName): CharacterCount {
      return getCharacterCount(field, component.form[field]);
    },

    get isFormValid(): boolean {
      return validateForm(component.form).isValid;
    },

    get editingNote(): Note | null {
      if (component.editingNoteId === null) return null;
      return findNoteById(component.notes, component.editingNoteId);
    },

    // アクション
    async createNote(): Promise<void> {
      await actions.createNote(component, () => navigateTo("list"));
    },

    async updateNote(): Promise<void> {
      if (component.editingNoteId === null) return;
      await actions.updateNote(component, component.editingNoteId, () =>
        navigateTo("list")
      );
    },

    async deleteNote(id: number): Promise<void> {
      if (!confirm("本当に削除しますか？")) return;
      await actions.deleteNote(component, id);
    },
  };

  return component;
};

// グローバルに公開（Alpine.js から参照するため）
declare global {
  interface Window {
    noteApp: typeof noteApp;
  }
}

window.noteApp = noteApp;
