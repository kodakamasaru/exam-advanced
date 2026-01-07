/**
 * グローバルエラーハンドラー
 *
 * 未キャッチの例外やPromise rejectionを捕捉し、
 * ロガーを通じて記録する
 *
 * このモジュールをimportするだけで自動的に初期化される
 */

import { logger } from "./logger";

/**
 * 未キャッチの例外ハンドラー
 */
const handleError = (event: ErrorEvent): void => {
  const error = event.error ?? new Error(event.message);

  logger.error("Uncaught error", {
    error,
    url: event.filename,
    line: event.lineno,
    column: event.colno,
    component: "global",
  });
};

/**
 * 未処理のPromise rejectionハンドラー
 */
const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  const error =
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

  logger.error("Unhandled promise rejection", {
    error,
    component: "global",
    reason: event.reason,
  });
};

// 初期化
window.addEventListener("error", handleError);
window.addEventListener("unhandledrejection", handleUnhandledRejection);

logger.info("GlobalErrorHandler initialized");
