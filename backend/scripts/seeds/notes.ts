import { db, notes } from "../../src/db/index.js";

export const seedNotes = async () => {
  const existing = await db.select().from(notes).limit(1);
  if (existing.length > 0) {
    console.log("  [notes] Already seeded, skipping...");
    return;
  }

  await db.insert(notes).values([
    { title: "最初のノート", content: "これは最初のノートです。" },
    { title: "買い物リスト", content: "牛乳、卵、パン" },
  ]);
  console.log("  [notes] Seeded 2 records");
};
