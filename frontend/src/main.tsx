/**
 * エントリポイント
 */

import { render } from "preact";
import { App } from "./App";
import { ErrorBoundary } from "./component";
import { logger } from "./lib";
import "./style/main.css";

logger.info("Application starting");

const root = document.getElementById("app");
if (root) {
  render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    root
  );

  logger.info("Application mounted");
}
