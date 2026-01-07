import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const analysis = pgTable("analysis", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  text: text("text").notNull(),
  totalWords: integer("total_words").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
