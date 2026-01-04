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
export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || "エラーが発生しました", response.status);
  }

  return data as T;
}

/**
 * GETリクエスト
 */
export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  return handleResponse<T>(response);
}

/**
 * POSTリクエスト
 */
export async function post<T, U>(path: string, body: U): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

/**
 * PUTリクエスト
 */
export async function put<T, U>(path: string, body: U): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

/**
 * DELETEリクエスト
 */
export async function del<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
  });
  return handleResponse<T>(response);
}
