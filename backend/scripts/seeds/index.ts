import { seedNotes } from "./notes.js";

const seeds = [seedNotes];

const runSeeds = async () => {
  console.log("Running seeds...");

  for (const seed of seeds) {
    await seed();
  }

  console.log("All seeds completed.");
};

runSeeds()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  });
