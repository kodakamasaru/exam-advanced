/**
 * HTTPクライアント基盤
 */

const API_BASE = "/api";

/**
 * API エラー
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API レスポンスの処理
 */
export const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || "エラーが発生しました", response.status);
  }

  return data as T;
};

/**
 * GETリクエスト
 */
export const get = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`);
  return handleResponse<T>(response);
};

/**
 * POSTリクエスト
 */
export const post = async <T, U>(path: string, body: U): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
};

/**
 * PUTリクエスト
 */
export const put = async <T, U>(path: string, body: U): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
};

/**
 * DELETEリクエスト
 */
export const del = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
  });
  return handleResponse<T>(response);
};
