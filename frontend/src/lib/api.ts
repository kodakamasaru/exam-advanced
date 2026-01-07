/**
 * HTTPクライアント基盤
 *
 * エラーハンドリング:
 * - ネットワークエラー → NetworkError
 * - HTTPエラー（4xx/5xx） → ApiError
 * - JSONパースエラー → ParseError
 * - 全エラーをロガーで記録
 */

import { logger } from "./logger";

const API_BASE = "/api";

/**
 * エラー種別
 */
export type ApiErrorType = "network" | "http" | "parse" | "unknown";

/**
 * API エラー基底クラス
 */
export class ApiError extends Error {
  readonly type: ApiErrorType;
  readonly status?: number;
  readonly url?: string;

  constructor(
    message: string,
    type: ApiErrorType,
    options?: { status?: number; url?: string; cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.type = type;
    this.status = options?.status;
    this.url = options?.url;
  }

  /**
   * ユーザー向けメッセージを取得
   */
  getUserMessage(): string {
    switch (this.type) {
      case "network":
        return "ネットワーク接続を確認してください";
      case "parse":
        return "サーバーからの応答を処理できませんでした";
      case "http":
        return this.getHttpErrorMessage();
      default:
        return "予期しないエラーが発生しました";
    }
  }

  private getHttpErrorMessage(): string {
    if (!this.status) return this.message;

    switch (this.status) {
      case 400:
        return this.message || "入力内容に問題があります";
      case 401:
        return "認証が必要です";
      case 403:
        return "アクセス権限がありません";
      case 404:
        return "リソースが見つかりません";
      case 422:
        return this.message || "入力内容を確認してください";
      case 429:
        return "リクエストが多すぎます。しばらく待ってから再試行してください";
      case 500:
        return "サーバーエラーが発生しました";
      case 502:
      case 503:
      case 504:
        return "サーバーが一時的に利用できません";
      default:
        return this.message || "エラーが発生しました";
    }
  }

  /**
   * リトライ可能なエラーかどうか
   */
  isRetryable(): boolean {
    if (this.type === "network") return true;
    if (this.type === "http" && this.status) {
      return this.status >= 500 || this.status === 429;
    }
    return false;
  }
}

/**
 * fetch実行（共通処理）
 */
const executeFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  try {
    return await fetch(url, options);
  } catch (error) {
    // ネットワークエラー（オフライン、DNS解決失敗、CORS等）
    const apiError = new ApiError(
      "ネットワークエラーが発生しました",
      "network",
      { url, cause: error }
    );

    logger.error("Network error", {
      error: apiError,
      url,
      action: "fetch",
    });

    throw apiError;
  }
};

/**
 * レスポンスボディをJSONとしてパース
 */
const parseResponseBody = async (
  response: Response,
  url: string
): Promise<unknown> => {
  const contentType = response.headers.get("content-type");

  // JSONレスポンスでない場合
  if (!contentType?.includes("application/json")) {
    // 空レスポンス（204 No Content等）
    if (response.status === 204) {
      return null;
    }

    // JSON以外のレスポンス
    const text = await response.text();
    logger.warn("Non-JSON response received", {
      url,
      status: response.status,
      contentType,
      body: text.slice(0, 200),
    });

    return { error: text || "Unexpected response format" };
  }

  try {
    return await response.json();
  } catch (error) {
    const apiError = new ApiError(
      "レスポンスの解析に失敗しました",
      "parse",
      { url, status: response.status, cause: error }
    );

    logger.error("JSON parse error", {
      error: apiError,
      url,
      status: response.status,
    });

    throw apiError;
  }
};

/**
 * API レスポンスの処理
 */
const handleResponse = async <T>(
  response: Response,
  url: string
): Promise<T> => {
  const data = await parseResponseBody(response, url);

  if (!response.ok) {
    const errorMessage =
      (data as { error?: string })?.error || "エラーが発生しました";

    const apiError = new ApiError(errorMessage, "http", {
      status: response.status,
      url,
    });

    logger.error("HTTP error", {
      error: apiError,
      url,
      status: response.status,
      responseBody: data,
    });

    throw apiError;
  }

  logger.debug("API response", { url, status: response.status });

  return data as T;
};

/**
 * GETリクエスト
 */
export const get = async <T>(path: string): Promise<T> => {
  const url = `${API_BASE}${path}`;
  logger.debug("GET request", { url });

  const response = await executeFetch(url);
  return handleResponse<T>(response, url);
};

/**
 * POSTリクエスト
 */
export const post = async <T, U>(path: string, body: U): Promise<T> => {
  const url = `${API_BASE}${path}`;
  logger.debug("POST request", { url, body });

  const response = await executeFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response, url);
};

/**
 * PUTリクエスト
 */
export const put = async <T, U>(path: string, body: U): Promise<T> => {
  const url = `${API_BASE}${path}`;
  logger.debug("PUT request", { url, body });

  const response = await executeFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response, url);
};

/**
 * DELETEリクエスト
 */
export const del = async <T>(path: string): Promise<T> => {
  const url = `${API_BASE}${path}`;
  logger.debug("DELETE request", { url });

  const response = await executeFetch(url, {
    method: "DELETE",
  });
  return handleResponse<T>(response, url);
};
