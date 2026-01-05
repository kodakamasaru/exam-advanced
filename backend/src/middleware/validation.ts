/**
 * バリデーションミドルウェア
 */

import type { Context, Next } from "hono";
import type { Result } from "../lib/result.js";
import type { ValidationError } from "../lib/validator.js";
import { formatValidationErrors } from "../lib/validator.js";

/**
 * バリデーション済みデータをContextに格納するキー
 */
const VALIDATED_BODY_KEY = "validatedBody";

/**
 * バリデーションミドルウェアを作成
 */
export const validate = <T>(
  validator: (input: T) => Result<T, ValidationError[]>
) => {
  return async (ctx: Context, next: Next): Promise<Response | void> => {
    const body = await ctx.req.json<T>();

    const result = validator(body);
    if (!result.ok) {
      return ctx.json({ error: formatValidationErrors(result.error) }, 422);
    }

    ctx.set(VALIDATED_BODY_KEY, result.value);
    await next();
  };
};

/**
 * バリデーション済みのボディを取得
 */
export const getValidatedBody = <T>(ctx: Context): T => {
  return ctx.get(VALIDATED_BODY_KEY) as T;
};
