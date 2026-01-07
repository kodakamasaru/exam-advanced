/**
 * アプリケーションルート
 */

import Router from "preact-router";
import { analysisRouteComponents } from "./feature/analysis";
import { NotFound, ErrorPage } from "./component";

export function App() {
  return (
    <Router>
      {analysisRouteComponents}
      <ErrorPage path="/error" />
      <NotFound default />
    </Router>
  );
}
