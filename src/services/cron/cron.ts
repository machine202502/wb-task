import startSyncTariffsBoxCron from "#services/cron/sync-tariffs-box.js";

const CRON_HOURLY = "0 * * * *";
const CRON_MINUTELY = "* * * * *";

export default async function startCrons(): Promise<void> {
    await Promise.all([
        startSyncTariffsBoxCron({
            retryLimit: 3,
            retryDelay: 60,
            expireInSeconds: 600,
            cron: CRON_MINUTELY,
            workOptions: { batchSize: 1 },
        }),
    ]);
}
