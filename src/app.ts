import boss from "#postgres/pg-boss/pg-boss.js";
import { migrate, seed } from "#postgres/knex.js";
import startCrons from "#services/cron/cron.js";
import startJobs from "#services/jobs/jobs.js";
import { getLogger } from "#logger.js";

const logger = getLogger("app");

await migrate.latest();
await seed.run();
await boss.start();
await startCrons();
await startJobs();

logger.info("All migrations and seeds have been run");
