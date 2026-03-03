import axios from "axios";
import apiWbConfig from "#config/api/wb/wb.js";
import type {
    TariffsBoxParams,
    TariffsBoxResponse,
} from "#types/api/wb/tariffs-box.js";

const path = "/api/v1/tariffs/box";

/**
 * Тарифы по коробам: хранение на складе WB, доставка до покупателя и до сортировочного центра.
 * GET https://common-api.wildberries.ru/api/v1/tariffs/box
 * @see https://dev.wildberries.ru/docs/openapi/wb-tariffs#tag/Stock-Tariffs/paths/~1api~1v1~1tariffs~1box/get
 */
export async function getBoxTariffs(
    params: TariffsBoxParams,
): Promise<TariffsBoxResponse> {
    const { data } = await axios.get<TariffsBoxResponse>(path, {
        baseURL: apiWbConfig.baseUrl,
        params: { date: params.date },
        headers: {
            Authorization: `Bearer ${apiWbConfig.apiToken}`,
        },
    });
    return data;
}
