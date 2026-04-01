"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashJson = hashJson;
exports.hashString = hashString;
const crypto_1 = require("crypto");
/** SHA-256 hash of any JSON-serializable value. Used for prompt inputHash tracking. */
function hashJson(value) {
    return (0, crypto_1.createHash)('sha256')
        .update(JSON.stringify(value))
        .digest('hex')
        .slice(0, 16);
}
/** SHA-256 hash of a plain string. */
function hashString(value) {
    return (0, crypto_1.createHash)('sha256').update(value).digest('hex').slice(0, 16);
}
//# sourceMappingURL=hash.utils.js.map