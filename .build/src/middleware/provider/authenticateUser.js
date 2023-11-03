"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars*/
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
exports.authenticateCognitoUser = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const getToken_1 = require("../auth/getToken");
function authenticateCognitoUser(cpf) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationData = {
            Username: cpf,
            Password: '123456',
        };
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(authenticationData);
        const poolData = {
            UserPoolId: process.env.CLIENTES_POOL_ID || '',
            ClientId: process.env.CLIENTES_POOL_CLIENT_ID || '',
        };
        const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
        const userData = {
            Username: cpf,
            Pool: userPool,
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        let sessionUserAttributes;
        const token = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    (0, getToken_1.getToken)(result).then((res) => {
                        resolve(res);
                    });
                },
                onFailure: (err) => {
                    console.log('deu erro', err);
                    reject(err);
                },
                newPasswordRequired: (userAttributes) => {
                    delete userAttributes.email_verified;
                    sessionUserAttributes = userAttributes;
                    cognitoUser.completeNewPasswordChallenge('123456', sessionUserAttributes, {
                        onSuccess: (_, __) => __awaiter(this, void 0, void 0, function* () {
                            resolve(authenticateCognitoUser(cpf));
                        }),
                        onFailure: (err) => {
                            console.error('falha na criação da nova senha');
                            reject(err);
                        }
                    });
                },
            });
        });
        return token;
    });
}
exports.authenticateCognitoUser = authenticateCognitoUser;
