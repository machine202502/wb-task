import dateFormat from "dateformat";
import { getBoxTariffs } from "#api/wb/tariffs-box.js";
import type { FetchBoxTariffsParams, TariffsBoxResult, TariffsBoxWarehouseItem } from "#types/sources/wb/tariffs-box.js";

function parseNumber(s: string): number | null {
    const normalized = String(s).trim().replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function parseDate(s: string): Date | null {
    const trimmed = String(s).trim();
    if (trimmed === "") return null;
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
}

export async function fetchBoxTariffs(params: FetchBoxTariffsParams): Promise<TariffsBoxResult> {
    const dateStr = dateFormat(params.date, "yyyy-mm-dd");
    const raw = await getBoxTariffs({ date: dateStr });
    const data = raw.response.data;

    const warehouseList: TariffsBoxWarehouseItem[] = data.warehouseList.map((w) => ({
        boxDeliveryBase: parseNumber(w.boxDeliveryBase),
        boxDeliveryCoefExpr: parseNumber(w.boxDeliveryCoefExpr),
        boxDeliveryLiter: parseNumber(w.boxDeliveryLiter),
        boxDeliveryMarketplaceBase: parseNumber(w.boxDeliveryMarketplaceBase),
        boxDeliveryMarketplaceCoefExpr: parseNumber(w.boxDeliveryMarketplaceCoefExpr),
        boxDeliveryMarketplaceLiter: parseNumber(w.boxDeliveryMarketplaceLiter),
        boxStorageBase: parseNumber(w.boxStorageBase),
        boxStorageCoefExpr: parseNumber(w.boxStorageCoefExpr),
        boxStorageLiter: parseNumber(w.boxStorageLiter),
        geoName: w.geoName,
        warehouseName: w.warehouseName,
    }));

    return {
        dtNextBox: parseDate(data.dtNextBox),
        dtTillMax: parseDate(data.dtTillMax),
        warehouseList,
    };
}
