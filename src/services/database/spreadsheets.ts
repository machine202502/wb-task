import knex from "#postgres/knex.js";
import type { SpreadsheetsInsert, SpreadsheetsRow } from "#types/database/spreadsheets.js";

const TABLE = "spreadsheets";

export async function insert(row: SpreadsheetsInsert): Promise<void> {
    await knex(TABLE).insert(row);
}

export async function deleteSpreadsheet(spreadsheetId: string): Promise<void> {
    await knex(TABLE).where("spreadsheet_id", spreadsheetId).del();
}

export async function getAll(): Promise<SpreadsheetsRow[]> {
    return knex(TABLE).select("*");
}
