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
exports.processMessage = void 0;
const db_1 = require("./db");
const processMessage = (workflowId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield (0, db_1.queryDB)('SELECT * FROM "Trigger" WHERE workflow_id = $1 LIMIT 1', [workflowId]);
    if (result.result != "success") {
        console.error(result.errorMessage);
        return;
    }
    console.log((_a = result.queryResult) === null || _a === void 0 ? void 0 : _a.rows);
});
exports.processMessage = processMessage;
function doquery() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exports.processMessage)("cm5tq19430005iusuzvya3pv0");
    });
}
doquery();
