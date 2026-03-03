import { PgBoss } from "pg-boss";
import pgBossConfig from "#config/pg-boss/pg-boss.js";

const boss = new PgBoss(pgBossConfig);

export default boss;
