
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { UserDataUserPoolType } from 'types/UserTypes';

import { AuthenticationDataType, IPoolData } from '../../types/CognitoInputTypes';
import { encryptPassword } from '../auth/encryptPassword';
import { getToken } from '../auth/getToken';
import { addCustomAttributes } from './createUser';
import { IUserAttributes } from 'types/RequestTypes';

async function authenticateCognitoUser(userDataPoolData: UserDataUserPoolType, userAttributes: IUserAttributes| null = null) {
  const authenticationData: AuthenticationDataType = {
    Username: userDataPoolData.Username,
    Password: userDataPoolData.Password ? userDataPoolData.Password : encryptPassword(userDataPoolData.Username),
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

  const token = new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (result) => {
        try {
          const res = await getToken(result, userDataPoolData.IdentityPoolId, userDataPoolData.UserPoolId);
          if (userAttributes) {
            const updatedAttributes = await addCustomAttributes({
              UserAttributes: Object.entries(userAttributes).map(([key, value]) => {
                return {
                  Name: key,
                  Value: value,
                }
              }),
              AccessToken: res,
            })
            console.log(updatedAttributes)
          }
          resolve(res);

        } catch (err) {
          console.error('falha na autenticação', err);
          reject(err);
        }
      },
      onFailure: (err: Error) => {
        console.error('falha na autenticação', err);
        reject(err);
      },
      newPasswordRequired: () => {
        // delete userAttributes.email_verified;

        cognitoUser.completeNewPasswordChallenge(
          authenticationData.Password,
          null,
          {
            onSuccess: async () => {
              resolve(authenticateCognitoUser(userDataPoolData, userAttributes));
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
