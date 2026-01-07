import { logger } from "../../src/lib/index.js";
import { seedAnalysis } from "./analysis.js";

const seeds = [seedAnalysis];

const runSeeds = async () => {
  logger.info("Running seeds...");

  for (const seed of seeds) {
    await seed();
  }

  logger.info("All seeds completed.");
};

runSeeds()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error("Seed error:", { error: e as Error });
    process.exit(1);
  });
