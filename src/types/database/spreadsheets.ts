/**
 * Строка таблицы spreadsheets (snake_case как в БД).
 */
export interface SpreadsheetsRow {
    spreadsheet_id: string;
}

/** Запись для вставки в таблицу spreadsheets. */
export type SpreadsheetsInsert = SpreadsheetsRow;
