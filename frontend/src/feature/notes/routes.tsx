/**
 * ノート機能のルート定義
 */

import { VNode } from "preact";
import { NoteList } from "./page/NoteList";
import { NoteCreate } from "./page/NoteCreate";
import { NoteEdit } from "./page/NoteEdit";

/**
 * ルートパス定義
 */
export const noteRoutes = {
  list: {
    path: "/",
    to: () => "/",
  },
  create: {
    path: "/create",
    to: () => "/create",
  },
  edit: {
    path: "/edit/:id",
    to: (id: number) => `/edit/${id}`,
  },
} as const;

/**
 * ルートコンポーネント定義
 */
export const noteRouteComponents: VNode[] = [
  <NoteList key="list" path={noteRoutes.list.path} />,
  <NoteCreate key="create" path={noteRoutes.create.path} />,
  <NoteEdit key="edit" path={noteRoutes.edit.path} />,
];
