"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutionByStatus = exports.queryDB = exports.pool = void 0;
exports.checkDbConnection = checkDbConnection;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "automate",
    password: process.env.DB_PASSWORD || "aniket",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
// Error table for known PostgreSQL error codes
const PGErrorTable = {
    errors: [
        { code: "ECONNREFUSED", message: "Connection refused" },
        { code: "ETIMEDOUT", message: "Connection timed out" },
        { code: "42601", message: "Syntax error" },
        { code: "42P01", message: "Undefined table" },
        { code: "42703", message: "Undefined column" },
        { code: "23505", message: "Unique constraint violation" },
        { code: "23503", message: "Foreign key violation" },
        { code: "23502", message: "NOT NULL constraint violation" },
        { code: "22P02", message: "Invalid text representation" },
        { code: "22007", message: "Invalid datetime format" },
        { code: "40001", message: "Serialization failure" },
        { code: "40P01", message: "Deadlock detected" },
        { code: "42501", message: "Insufficient privileges" },
        { code: "53200", message: "Out of memory" },
    ],
};
const queryDB = (query, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield exports.pool.query(query, value);
        return { result: "success", queryResult: res };
    }
    catch (e) {
        console.error("Database error:", e.message);
        if (e.code === "23505") {
            return {
                result: "error",
                errorMessage: "Duplicate move",
                details: e.detail,
            };
        }
        for (const msg of PGErrorTable.errors) {
            if (e.code === msg.code) {
                return {
                    result: "error",
                    errorMessage: msg.message,
                    details: e.detail,
                };
            }
        }
        return {
            result: "error",
            errorMessage: `Unknown database error: ${e.message}`,
            details: e.detail,
        };
    }
});
exports.queryDB = queryDB;
const getExecutionByStatus = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (status = "pending") {
    var _a;
    try {
        const query = `
    SELECT * FROM execution
    WHERE execution_time >= NOW()
    AND status = $1;
  `;
        const queryRes = yield (0, exports.queryDB)(query, [status]);
        if (queryRes.result == "error") {
            throw new Error(queryRes.errorMessage);
        }
        const res = (_a = queryRes.queryResult) === null || _a === void 0 ? void 0 : _a.rows;
    }
    catch (e) {
        console.error(e);
    }
});
exports.getExecutionByStatus = getExecutionByStatus;
function checkDbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.pool.query("SELECT 1");
    });
}
exports.default = exports.pool;
