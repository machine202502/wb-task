import type { Queue, WorkOptions } from "pg-boss";

export type StartSyncTariffsBoxCronOptions = Omit<Queue, "name"> & {
    cron: string;
    /** Опции воркера (batchSize и др.), передаются в boss.work(). */
    workOptions?: Pick<WorkOptions, "batchSize">;
};
