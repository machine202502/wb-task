/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema
        .createTable("tariffs_box", (table) => {
            table.increments("id").primary();
            table.string("hash", 32).notNullable().unique();
            table.date("dt_next_box").nullable();
            table.date("dt_till_max").nullable();
            table.decimal("box_delivery_base", 14, 4).nullable();
            table.decimal("box_delivery_coef_expr", 14, 4).nullable();
            table.decimal("box_delivery_liter", 14, 4).nullable();
            table.decimal("box_delivery_marketplace_base", 14, 4).nullable();
            table.decimal("box_delivery_marketplace_coef_expr", 14, 4).nullable();
            table.decimal("box_delivery_marketplace_liter", 14, 4).nullable();
            table.decimal("box_storage_base", 14, 4).nullable();
            table.decimal("box_storage_coef_expr", 14, 4).nullable();
            table.decimal("box_storage_liter", 14, 4).nullable();
            table.string("geo_name", 255).notNullable();
            table.string("warehouse_name", 255).notNullable();
        })
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists("tariffs_box");
}
