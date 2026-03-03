import fs from "node:fs";
import path from "node:path";

const SEED_FILE = "seed.spreadsheets.json";

/**
 * Подгружает spreadsheet_id из seed.spreadsheets.json в корне приложения (string[]). Если файла нет или он пустой — сид не вставляет строк.
 *
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    try {
        const filePath = path.join(process.cwd(), SEED_FILE);
        const raw = await fs.promises.readFile(filePath, "utf8");
        const list = JSON.parse(raw);
        if (!Array.isArray(list) || list.length === 0) return;
        const rows = list.filter((id) => typeof id === "string").map((spreadsheet_id) => ({ spreadsheet_id }));
        if (rows.length === 0) return;
        await knex("spreadsheets").insert(rows).onConflict(["spreadsheet_id"]).ignore();
    } catch {
        // файл недоступен или ошибка — ничего не делаем
    }
}
