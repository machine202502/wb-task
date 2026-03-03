import boss from "#postgres/pg-boss/pg-boss.js";
import { googleSheetsConfig } from "#config/google/sheets.js";
import { getAll } from "#services/database/spreadsheets.js";
import type { SyncOneSheetPayload, SyncTariffsToSheetsPayload, SyncTariffsToSheetsWorkerOptions } from "#types/jobs/sync-tariffs-to-sheets.js";
import type { TariffsBoxSheetRow } from "#types/database/tariffs-box.js";
import { getLogger } from "#logger.js";

const logger = getLogger("sync-tariffs-to-sheets");

const SYNC_TARIFFS_TO_SHEETS_QUEUE = "sync-tariffs-to-sheets";
const SYNC_ONE_SHEET_QUEUE = "sync-tariffs-one-sheet";

const SHEET_NAME = "stocks_coefs";
const RANGE = `${SHEET_NAME}!A:Z`;

/** Порядок колонок в таблице (заголовки и строки); warehouse_name, geo_name в начале. */
const COLUMNS: (keyof TariffsBoxSheetRow)[] = [
    "warehouse_name",
    "geo_name",
    "box_delivery_base",
    "box_delivery_coef_expr",
    "box_delivery_liter",
    "box_delivery_marketplace_base",
    "box_delivery_marketplace_coef_expr",
    "box_delivery_marketplace_liter",
    "box_storage_base",
    "box_storage_coef_expr",
    "box_storage_liter",
];

/** Запускает джобу синхронизации тарифов в Google Sheets. */
export async function sendSyncTariffsToSheetsJob(payload: SyncTariffsToSheetsPayload): Promise<string | null> {
    return boss.send(SYNC_TARIFFS_TO_SHEETS_QUEUE, payload);
}

function sheetRowsFromPayload(rows: TariffsBoxSheetRow[]): (string | number)[][] {
    const sorted = [...rows].sort((a, b) => {
        const wa = (a.warehouse_name ?? "") as string;
        const wb = (b.warehouse_name ?? "") as string;
        if (wa !== wb) return wa.localeCompare(wb);
        const ga = (a.geo_name ?? "") as string;
        const gb = (b.geo_name ?? "") as string;
        return ga.localeCompare(gb);
    });
    const header = COLUMNS as string[];
    const data = sorted.map((r) =>
        COLUMNS.map((c) => {
            const v = r[c];
            return v === null || v === undefined ? "" : v;
        }),
    );
    return [header, ...data];
}

/** Регистрирует воркеры: раздача по таблицам и синхрон одной таблицы. Вызывать после boss.start(). */
export async function startSyncTariffsToSheetsWorker(options: SyncTariffsToSheetsWorkerOptions): Promise<void> {
    const { all, one } = options;
    await boss.createQueue(SYNC_TARIFFS_TO_SHEETS_QUEUE, all.queueOptions);
    await boss.createQueue(SYNC_ONE_SHEET_QUEUE, one.queueOptions);
    await boss.work(SYNC_TARIFFS_TO_SHEETS_QUEUE, all.workerOptions ?? {}, async (jobs) => {
        for (const job of jobs) {
            await syncTariffsToSheets(job.data as SyncTariffsToSheetsPayload);
        }
    });
    await boss.work(SYNC_ONE_SHEET_QUEUE, one.workerOptions ?? {}, async (jobs) => {
        for (const job of jobs) {
            await runSyncOneSheet(job.data as SyncOneSheetPayload);
        }
    });
}

/** Раздаёт джобы синхронизации по одной таблице на каждый spreadsheet из БД. */
async function syncTariffsToSheets(payload: SyncTariffsToSheetsPayload): Promise<void> {
    try {
        const { rows } = payload;
        if (rows.length === 0) return;
        logger.info("syncTariffsToSheets: start; строк:", rows.length);

        const spreadsheets = await getAll();
        if (spreadsheets.length === 0) return;
        logger.info("syncTariffsToSheets: получен список таблиц; штук:", spreadsheets.length);

        for (const { spreadsheet_id } of spreadsheets) {
            await boss.send(SYNC_ONE_SHEET_QUEUE, { spreadsheetId: spreadsheet_id, rows });
        }
        logger.info("syncTariffsToSheets: успех; отправлено джоб:", spreadsheets.length);
    } catch (error) {
        logger.error("syncTariffsToSheets: ошибка", error);
        throw error;
    }
}

/** Создаёт лист stocks_coefs в таблице, если его ещё нет. */
async function ensureSheetExists(
    sheets: typeof googleSheetsConfig.client,
    spreadsheetId: string,
): Promise<void> {
    const { data } = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "sheets.properties.title",
    });
    const hasSheet = data.sheets?.some(
        (s) => (s.properties?.title ?? "").trim() === SHEET_NAME,
    );
    if (hasSheet) return;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
        },
    });
}

/** Синхронизирует одну Google-таблицу: очистка листа и запись переданных строк. */
async function runSyncOneSheet(payload: SyncOneSheetPayload): Promise<void> {
    try {
        const { spreadsheetId, rows } = payload;
        if (rows.length === 0) return;
        logger.info("runSyncOneSheet: start; spreadsheetId:", spreadsheetId, "строк:", rows.length);

        const values = sheetRowsFromPayload(rows);
        const sheets = googleSheetsConfig.client;

        await ensureSheetExists(sheets, spreadsheetId);
        logger.info("runSyncOneSheet: лист проверен/создан");

        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: RANGE,
        });
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${SHEET_NAME}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });
        logger.info("runSyncOneSheet: успех; записано строк:", values.length);
    } catch (error) {
        logger.error("runSyncOneSheet: ошибка", error);
        throw error;
    }
}
