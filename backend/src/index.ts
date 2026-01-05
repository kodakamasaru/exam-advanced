import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { noteController } from "./controller/noteController.js";

const app = new Hono();

// CORS設定（フロントエンドからのアクセスを許可）
app.use("/api/*", cors());

// APIルート
app.route("/api", noteController);

// ヘルスチェック
app.get("/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT || "8080", 10);

console.log(`API Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
