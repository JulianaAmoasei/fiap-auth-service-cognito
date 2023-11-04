/* eslint-disable @typescript-eslint/no-unused-vars*/

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { UserDataUserPoolType } from 'types/UserTypes';

import { AuthenticationDataType, IPoolData } from '../../types/CognitoInputTypes';
import { encryptPassword } from '../auth/encryptPassword';
import { getToken } from '../auth/getToken';

async function authenticateCognitoUser(userDataPoolData: UserDataUserPoolType) {
  const authenticationData: AuthenticationDataType = {
    Username: userDataPoolData.Username,
    Password: encryptPassword(userDataPoolData.Username),
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const poolData: IPoolData = {
    UserPoolId: userDataPoolData.UserPoolId || '',
    ClientId: userDataPoolData.ClientId || '',
  };

  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: userDataPoolData.Username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  let sessionUserAttributes;

  const token = new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        getToken(result, userDataPoolData.IdentityPoolId).then((res) => {
          resolve(res)
        })
      },
      onFailure: (err: Error) => {
        console.error('falha na autenticação', err);
        reject(err);
      },
      newPasswordRequired: (userAttributes) => {
        // delete userAttributes.email_verified;
        sessionUserAttributes = userAttributes;
  
        cognitoUser.completeNewPasswordChallenge(
          encryptPassword(userDataPoolData.Username),
          null,
          {
            onSuccess: async (_, __) => {
              resolve(authenticateCognitoUser(userDataPoolData));
              
            },
            onFailure: (err: Error): void => {
              console.error('falha na criação da nova senha');
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
