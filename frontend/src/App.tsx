/**
 * アプリケーションルート
 */

import Router from "preact-router";
import { noteRouteComponents } from "./feature/notes";

export function App() {
  return <Router>{noteRouteComponents}</Router>;
}
