import env from "#config/env/env.js";
import { google } from "googleapis";

const keyFile = env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyFile) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
}

const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

/** Конфиг Google Sheets API v4 (сервисный аккаунт). */
export const googleSheetsConfig = {
    client: google.sheets({ version: "v4", auth }),
};
