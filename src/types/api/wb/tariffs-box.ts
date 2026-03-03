/**
 * GET /api/v1/tariffs/box — тарифы по коробам (хранение, доставка).
 * @see https://dev.wildberries.ru/docs/openapi/wb-tariffs#tag/Stock-Tariffs/paths/~1api~1v1~1tariffs~1box/get
 */

/** Входные параметры запроса тарифов по коробам */
export interface TariffsBoxParams {
    /** Дата, на которую запрашиваются тарифы. Формат YYYY-MM-DD */
    date: string;
}

/**
 * Тарифы по коробам по одному складу.
 * Метод возвращает ставки: хранение на складе WB, доставка от склада/СЦ до покупателя, доставка от покупателя до СЦ.
 */
export interface TariffsBoxWarehouseItem {
    /** Базовая ставка (₽) за доставку от склада/СЦ до покупателя */
    boxDeliveryBase: string;
    /** Коэффициент для расчёта доставки от склада/СЦ до покупателя */
    boxDeliveryCoefExpr: string;
    /** Ставка за литр (₽/л) при расчёте доставки от склада/СЦ до покупателя */
    boxDeliveryLiter: string;
    /** Базовая ставка (₽) за доставку маркетплейса до покупателя */
    boxDeliveryMarketplaceBase: string;
    /** Коэффициент для расчёта доставки маркетплейса до покупателя */
    boxDeliveryMarketplaceCoefExpr: string;
    /** Ставка за литр (₽/л) при расчёте доставки маркетплейса до покупателя */
    boxDeliveryMarketplaceLiter: string;
    /** Базовая ставка (₽) за хранение на складе WB */
    boxStorageBase: string;
    /** Коэффициент для расчёта хранения на складе WB */
    boxStorageCoefExpr: string;
    /** Ставка за литр (₽/л) при расчёте хранения на складе WB */
    boxStorageLiter: string;
    /** Название региона (география склада) */
    geoName: string;
    /** Название склада */
    warehouseName: string;
}

/** Данные ответа: даты действия тарифов и список тарифов по складам */
export interface TariffsBoxData {
    /** Дата следующего изменения тарифов по коробам (YYYY-MM-DD) */
    dtNextBox: string;
    /** Тариф действует до указанной даты (YYYY-MM-DD) */
    dtTillMax: string;
    /** Тарифы по коробам в разрезе складов */
    warehouseList: TariffsBoxWarehouseItem[];
}

/** Ответ API GET /api/v1/tariffs/box */
export interface TariffsBoxResponse {
    response: {
        data: TariffsBoxData;
    };
}
