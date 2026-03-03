import log4js from "log4js";

log4js.configure({
    appenders: {
        out: { type: "stdout" },
    },
    categories: {
        default: { appenders: ["out"], level: "info" },
    },
});

export function getLogger(category?: string): log4js.Logger {
    return log4js.getLogger(category);
}

export default getLogger();
