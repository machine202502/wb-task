import { createHash } from "node:crypto";
import knex from "#postgres/knex.js";
import type { TariffsBoxInsertInput } from "#types/database/tariffs-box.js";

/** Поле конфликта для upsert */
const CONFLICT_COLUMN = "hash";

/** Колонки для обновления при конфликте (все кроме id и hash). */
const MERGE_COLUMNS = [
    "dt_next_box",
    "dt_till_max",
    "box_delivery_base",
    "box_delivery_coef_expr",
    "box_delivery_liter",
    "box_delivery_marketplace_base",
    "box_delivery_marketplace_coef_expr",
    "box_delivery_marketplace_liter",
    "box_storage_base",
    "box_storage_coef_expr",
    "box_storage_liter",
    "geo_name",
    "warehouse_name",
] as const;

function computeHash(geoName: string, warehouseName: string): string {
    return createHash("md5")
        .update(geoName + "||" + warehouseName)
        .digest("hex");
}

/**
 * Upsert множества записей в tariffs_box. Если запись с таким hash есть — обновляет поля, иначе вставляет. Hash вычисляется как MD5(geo_name + '||' +
 * warehouse_name). В одном батче не должно быть дубликатов по hash — дубликаты убираются (последняя запись побеждает).
 */
export async function upsertTariffsBox(rows: TariffsBoxInsertInput[]): Promise<void> {
    if (rows.length === 0) {
        return;
    }

    const rowsWithHash = rows.map((r) => ({
        ...r,
        hash: computeHash(r.geo_name, r.warehouse_name),
    }));

    const byHash = new Map(rowsWithHash.map((r) => [r.hash, r]));
    const uniqueRows = [...byHash.values()];

    await knex("tariffs_box").insert(uniqueRows).onConflict(CONFLICT_COLUMN).merge(MERGE_COLUMNS);
}
