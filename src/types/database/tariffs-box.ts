/**
 * Строка таблицы tariffs_box (snake_case как в БД).
 */
export interface TariffsBoxRow {
    id: number;
    hash: string;
    dt_next_box: Date | null;
    dt_till_max: Date | null;
    box_delivery_base: number | null;
    box_delivery_coef_expr: number | null;
    box_delivery_liter: number | null;
    box_delivery_marketplace_base: number | null;
    box_delivery_marketplace_coef_expr: number | null;
    box_delivery_marketplace_liter: number | null;
    box_storage_base: number | null;
    box_storage_coef_expr: number | null;
    box_storage_liter: number | null;
    geo_name: string;
    warehouse_name: string;
}

/** Запись для вставки/обновления (id генерируется БД, hash вычисляется сервисом при необходимости). */
export type TariffsBoxInsert = Omit<TariffsBoxRow, "id">;

/** Запись для передачи в upsert без hash (hash = MD5(geo_name + '||' + warehouse_name)). */
export type TariffsBoxInsertInput = Omit<TariffsBoxInsert, "hash">;

/** Строка тарифов для выгрузки в Google Sheets (без полей дат). */
export type TariffsBoxSheetRow = Omit<TariffsBoxInsertInput, "dt_next_box" | "dt_till_max">;
