/**
 * Result型 - 成功/失敗を型安全に表現
 */

export type Success<T> = {
  ok: true;
  value: T;
};

export type Failure<E = string> = {
  ok: false;
  error: E;
};

export type Result<T, E = string> = Success<T> | Failure<E>;

/**
 * 成功結果を作成
 */
export const ok = <T>(value: T): Success<T> => ({
  ok: true,
  value,
});

/**
 * 失敗結果を作成
 */
export const err = <E = string>(error: E): Failure<E> => ({
  ok: false,
  error,
});
