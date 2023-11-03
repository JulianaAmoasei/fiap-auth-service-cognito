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
exports.confirmUser = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
function confirmUser(cpf) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({ region: 'us-east-1' });
        const input = {
            UserPoolId: process.env.CLIENTES_POOL_ID,
            Username: cpf,
        };
        const command = new client_cognito_identity_provider_1.AdminGetUserCommand(input);
        const response = yield client.send(command);
        return response;
    });
}
exports.confirmUser = confirmUser;
