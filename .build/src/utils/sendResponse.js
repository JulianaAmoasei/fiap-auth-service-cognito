"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (statusCode, body, headers = {}) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: Object.assign({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true }, headers),
});
