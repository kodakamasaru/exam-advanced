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
 * Alpine.js用のアプリケーション定義
 */
export const noteApp = () => {
  return {
    // 状態（state.tsから初期値を取得）
    ...initialState,

    /**
     * 初期化
     */
    async init(): Promise<void> {
      await actions.fetchNotes(this as AppState);
      await this.handleRouteChange();
      onRouteChange(() => this.handleRouteChange());
    },

    /**
     * ルート変更ハンドラ
     */
    async handleRouteChange(): Promise<void> {
      const { currentRoute, editingNoteId } = parseRoute();
      this.currentRoute = currentRoute;
      this.editingNoteId = editingNoteId;
      this.error = "";
      this.success = "";

      if (currentRoute === "edit" && editingNoteId !== null) {
        const note = this.notes.find((n: Note) => n.id === editingNoteId);
        if (note) {
          actions.initEditForm(this as AppState, note);
        } else {
          this.error = "ノートが見つかりません";
          navigateTo("list");
        }
      }

      if (currentRoute === "create") {
        actions.resetForm(this as AppState);
      }
    },

    // ナビゲーション
    navigateToList: () => navigateTo("list"),
    navigateToCreate: () => navigateTo("create"),
    navigateToEdit: (noteId: number) => navigateTo("edit", noteId),

    formatDate: formatDateJa,

    // バリデーション
    validateField(field: FieldName): void {
      actions.validateFormField(this as AppState, field);
    },

    getCharCount(field: FieldName): CharacterCount {
      return getCharacterCount(field, this.form[field]);
    },

    get isFormValid(): boolean {
      return validateForm(this.form).isValid;
    },

    get editingNote(): Note | null {
      if (this.editingNoteId === null) return null;
      return this.notes.find((n: Note) => n.id === this.editingNoteId) ?? null;
    },

    // アクション
    async createNote(): Promise<void> {
      await actions.createNote(this as AppState, () => navigateTo("list"));
    },

    async updateNote(): Promise<void> {
      if (this.editingNoteId === null) return;
      await actions.updateNote(this as AppState, this.editingNoteId, () =>
        navigateTo("list")
      );
    },

    async deleteNote(id: number): Promise<void> {
      if (!confirm("本当に削除しますか？")) return;
      await actions.deleteNote(this as AppState, id);
    },
  };
};

// グローバルに公開（Alpine.js から参照するため）
declare global {
  interface Window {
    noteApp: typeof noteApp;
  }
}

window.noteApp = noteApp;
