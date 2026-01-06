/**
 * アプリケーションルート
 */

import Router from "preact-router";
import { noteRouteComponents } from "./feature/notes";
import { NotFound } from "./component";

export function App() {
  return (
    <Router>
      {noteRouteComponents}
      <NotFound default />
    </Router>
  );
}
