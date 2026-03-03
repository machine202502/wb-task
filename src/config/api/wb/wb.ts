import env from "#config/env/env.js";

const apiWbConfig = {
    baseUrl: env.WB_BASE_URL ?? "https://common-api.wildberries.ru",
    apiToken: env.WB_API_TOKEN,
} as const;

export default apiWbConfig;
