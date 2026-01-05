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
 * IDパースミドルウェア
 * :id パラメータを正の整数としてパースし、Contextに格納
 */
export const parseId = () => {
  return async (ctx: Context, next: Next): Promise<Response | void> => {
    const idParam = ctx.req.param("id");
    const id = parseInt(idParam, 10);

    if (isNaN(id) || id <= 0) {
      return ctx.json<ErrorResponse>(
        { error: "IDは正の整数で指定してください" },
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
export const getParsedId = (ctx: Context): number => {
  return ctx.get(PARSED_ID_KEY) as number;
};
