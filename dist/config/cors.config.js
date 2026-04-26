"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedOrigins = getAllowedOrigins;
exports.isAllowedOrigin = isAllowedOrigin;
exports.getCorsOptions = getCorsOptions;
exports.getSocketCorsOptions = getSocketCorsOptions;
const defaultOrigins = [
    "http://localhost:3000",
];
function normalizeOrigins(value) {
    if (!value) {
        return [];
    }
    return value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}
function getAllowedOrigins() {
    const configuredOrigins = new Set([
        ...defaultOrigins,
        ...normalizeOrigins(process.env.FRONTEND_URL),
        ...normalizeOrigins(process.env.CORS_ORIGINS),
    ]);
    return [...configuredOrigins];
}
function isAllowedOrigin(origin) {
    if (!origin) {
        return true;
    }
    return getAllowedOrigins().includes(origin);
}
function getCorsOptions() {
    return {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin ${origin ?? "unknown"} is not allowed by CORS.`));
        },
        credentials: true,
    };
}
function getSocketCorsOptions() {
    return {
        origin: getAllowedOrigins(),
        credentials: true,
    };
}
//# sourceMappingURL=cors.config.js.map