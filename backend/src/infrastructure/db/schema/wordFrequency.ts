import { pgTable, serial, text, integer, numeric, uuid } from "drizzle-orm/pg-core";
import { analysis } from "./analysis.js";

export const wordFrequency = pgTable("word_frequency", {
  id: serial("id").primaryKey(),
  analysisId: uuid("analysis_id")
    .notNull()
    .references(() => analysis.id, { onDelete: "cascade" }),
  word: text("word").notNull(),
  count: integer("count").notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  rank: integer("rank").notNull(),
});
