import type { Queue, WorkOptions } from "pg-boss";
import type { TariffsBoxSheetRow } from "#types/database/tariffs-box.js";

export interface SyncTariffsToSheetsPayload {
    rows: TariffsBoxSheetRow[];
}

/** Полезная нагрузка джобы синхронизации одной таблицы. */
export interface SyncOneSheetPayload {
    spreadsheetId: string;
    rows: TariffsBoxSheetRow[];
}

export interface SyncTariffsToSheetsQueueConfig {
    queueOptions: Omit<Queue, "name">;
    workerOptions?: Pick<WorkOptions, "batchSize">;
}

export interface SyncTariffsToSheetsWorkerOptions {
    /** Очередь «раздача по всем таблицам». */
    all: SyncTariffsToSheetsQueueConfig;
    /** Очередь «синхрон одной таблицы». */
    one: SyncTariffsToSheetsQueueConfig;
}
