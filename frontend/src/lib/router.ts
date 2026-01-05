/**
 * シンプルなクライアントサイドルーター
 */

export type Route = "list" | "create" | "edit";

export interface RouterState {
  currentRoute: Route;
  editingNoteId: number | null;
}

/**
 * URLハッシュからルート情報を解析
 */
export const parseRoute = (): RouterState => {
  const hash = window.location.hash.slice(1); // '#' を除去

  if (hash === "create" || hash === "/create") {
    return { currentRoute: "create", editingNoteId: null };
  }

  const editMatch = hash.match(/^\/?(edit)\/(\d+)$/);
  if (editMatch?.[2]) {
    return { currentRoute: "edit", editingNoteId: parseInt(editMatch[2], 10) };
  }

  return { currentRoute: "list", editingNoteId: null };
};

/**
 * ルートを変更
 */
export const navigateTo = (route: Route, noteId?: number): void => {
  switch (route) {
    case "list":
      window.location.hash = "";
      break;
    case "create":
      window.location.hash = "create";
      break;
    case "edit":
      if (noteId !== undefined) {
        window.location.hash = `edit/${noteId}`;
      }
      break;
  }
};

/**
 * ルート変更イベントをリッスン
 */
export const onRouteChange = (callback: (state: RouterState) => void): void => {
  window.addEventListener("hashchange", () => {
    callback(parseRoute());
  });
};
