import env from "#config/env/env.js";
import type { ConstructorOptions } from "pg-boss";

const config: ConstructorOptions = {
    host: env.POSTGRES_HOST ?? "localhost",
    port: env.POSTGRES_PORT ?? 5432,
    database: env.POSTGRES_DB ?? "postgres",
    user: env.POSTGRES_USER ?? "postgres",
    password: env.POSTGRES_PASSWORD ?? "",
};

export default config;
