/**
 * IDパースミドルウェア
 */

import type { Context, Next } from "hono";
import type { ErrorResponse } from "../dto/common.js";

/**
 * パース済みIDをContextに格納するキー
 */
const PARSED_ID_KEY = "parsedId";

/**
 * UUIDの形式チェック
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * IDパースミドルウェア
 * :id パラメータをUUIDとしてバリデーションし、Contextに格納
 */
export const parseId = () => {
  return async (ctx: Context, next: Next): Promise<Response | void> => {
    const id = ctx.req.param("id");

    if (!UUID_REGEX.test(id)) {
      return ctx.json<ErrorResponse>(
        { error: "IDはUUID形式で指定してください" },
        400
      );
    }

    ctx.set(PARSED_ID_KEY, id);
    await next();
  };
};

/**
 * パース済みIDを取得
 */
export const getParsedId = (ctx: Context): string => {
  return ctx.get(PARSED_ID_KEY) as string;
};
