import boss from "#postgres/pg-boss/pg-boss.js";
import { upsertTariffsBox } from "#services/database/tariffs-box.js";
import { syncTariffsToSheetsJob } from "#services/jobs/index.js";
import { fetchBoxTariffs } from "#services/sources/wb/tariffs-box.js";
import type { StartSyncTariffsBoxCronOptions } from "#types/cron/sync-tariffs-box.js";
import type { TariffsBoxInsertInput, TariffsBoxSheetRow } from "#types/database/tariffs-box.js";
import { getLogger } from "#logger.js";

const logger = getLogger("sync-tariffs-box");
const SYNC_TARIFFS_BOX_QUEUE = "sync-tariffs-box";

/** Синхронизирует тарифы по коробам за указанную дату: запрашивает данные в WB, сохраняет в tariffs_box (upsert) и ставит джобу на выгрузку в Google Sheets. */
export async function syncTariffsBox(date: Date): Promise<void> {
    try {
        console.log("syncTariffsBox: start");

        const result = await fetchBoxTariffs({ date });
        logger.info("syncTariffsBox: запрос тарифов в WB выполнен; складов:", result.warehouseList.length);

        const rows: TariffsBoxInsertInput[] = result.warehouseList.map((w) => ({
            dt_next_box: result.dtNextBox,
            dt_till_max: result.dtTillMax,
            box_delivery_base: w.boxDeliveryBase,
            box_delivery_coef_expr: w.boxDeliveryCoefExpr,
            box_delivery_liter: w.boxDeliveryLiter,
            box_delivery_marketplace_base: w.boxDeliveryMarketplaceBase,
            box_delivery_marketplace_coef_expr: w.boxDeliveryMarketplaceCoefExpr,
            box_delivery_marketplace_liter: w.boxDeliveryMarketplaceLiter,
            box_storage_base: w.boxStorageBase,
            box_storage_coef_expr: w.boxStorageCoefExpr,
            box_storage_liter: w.boxStorageLiter,
            geo_name: w.geoName,
            warehouse_name: w.warehouseName,
        }));
        const sheetRows: TariffsBoxSheetRow[] = rows.map(({ dt_next_box, dt_till_max, ...r }) => r);

        await upsertTariffsBox(rows);
        logger.info("syncTariffsBox: запись в БД выполнена; строк:", rows.length);

        await syncTariffsToSheetsJob({ rows: sheetRows });
        logger.info("syncTariffsBox: успех");
    } catch (error) {
        logger.error("syncTariffsBox: ошибка", error);
        throw error;
    }
}

export default async function startSyncTariffsBoxCron(options: StartSyncTariffsBoxCronOptions): Promise<void> {
    const { cron, workOptions, ...queueOptions } = options;
    await boss.createQueue(SYNC_TARIFFS_BOX_QUEUE, queueOptions);
    await boss.schedule(SYNC_TARIFFS_BOX_QUEUE, cron);
    await boss.work(SYNC_TARIFFS_BOX_QUEUE, { includeMetadata: true, ...workOptions }, async (jobs) => {
        for (const job of jobs) {
            await syncTariffsBox(job.createdOn);
        }
    });
}
