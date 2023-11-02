import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { getToken } from '../auth/getToken';

async function authenticateCognitoUser(cpf: any) {
  const authenticationData: any = {
    Username: cpf,
    Password: "123456",
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const poolData: any = {
    UserPoolId: process.env.CLIENTES_POOL_ID,
    ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
  };

  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: cpf,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  let sessionUserAttributes;

  const token = new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        getToken(result).then((res) => {
          resolve(res)
        })
      },
      onFailure: (err) => {
        console.log("deu erro", err);
        reject(err);
      },
      newPasswordRequired: (userAttributes) => {
        delete userAttributes.email_verified;
        sessionUserAttributes = userAttributes;
  
        cognitoUser.completeNewPasswordChallenge(
          "123456",
          sessionUserAttributes,
          {
            onSuccess: async (session: any, userConfirmationNecessary?: boolean | undefined) => {
              resolve(authenticateCognitoUser(cpf));
              ;
            },
            onFailure: (err: any): void => {
              console.error("falha na criação da nova senha");
              reject(err)
              ;
            }
          }
        );
      },
    });
  })
  return token;
}

export { authenticateCognitoUser };
