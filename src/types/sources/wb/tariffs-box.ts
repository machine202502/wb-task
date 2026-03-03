/** Параметры запроса тарифов по коробам (верхнеуровневый слой) */
export interface FetchBoxTariffsParams {
    /** Дата, на которую запрашиваются тарифы */
    date: Date;
}

export interface TariffsBoxWarehouseItem {
    boxDeliveryBase: number | null;
    boxDeliveryCoefExpr: number | null;
    boxDeliveryLiter: number | null;
    boxDeliveryMarketplaceBase: number | null;
    boxDeliveryMarketplaceCoefExpr: number | null;
    boxDeliveryMarketplaceLiter: number | null;
    boxStorageBase: number | null;
    boxStorageCoefExpr: number | null;
    boxStorageLiter: number | null;
    geoName: string;
    warehouseName: string;
}

export interface TariffsBoxResult {
    dtNextBox: Date | null;
    dtTillMax: Date | null;
    warehouseList: TariffsBoxWarehouseItem[];
}
