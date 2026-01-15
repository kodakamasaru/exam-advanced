/**
 * エントリポイント
 */

import { render } from "preact";
import { App } from "./App";
import { ErrorBoundary } from "./component";
import { logger } from "./lib";
import "./style/main.css";

/**
 * アプリケーションをマウント
 */
const mountApp = () => {
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
};

/**
 * MSWを起動（mock環境のみ）
 */
const enableMocking = async () => {
  if (import.meta.env.VITE_USE_MOCK !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });

  logger.info("MSW enabled");
};

logger.info("Application starting");

enableMocking().then(mountApp);
