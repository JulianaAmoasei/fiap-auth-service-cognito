"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = void 0;
const crypto_1 = require("crypto");
function encryptPassword(cpf) {
    const hash = (0, crypto_1.createHash)('md5');
    hash.update(cpf);
    return hash.digest('hex');
}
exports.encryptPassword = encryptPassword;
