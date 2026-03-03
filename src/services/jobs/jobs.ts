import { startSyncTariffsToSheetsWorker } from "#services/jobs/sync-tariffs-to-sheets.js";

export default async function startJobs(): Promise<void> {
    await startSyncTariffsToSheetsWorker({
        all: {
            queueOptions: { retryLimit: 1, retryDelay: 60, expireInSeconds: 600 },
            workerOptions: { batchSize: 1 },
        },
        one: {
            queueOptions: { retryLimit: 2, retryDelay: 30, expireInSeconds: 600 },
            workerOptions: { batchSize: 1 },
        },
    });
}
