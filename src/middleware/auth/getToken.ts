import { CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

async function getToken(result: CognitoUserSession) {
  AWS.config.region = 'us-east-1';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID || '',
    Logins: {
      [`cognito-idp.us-east-1.amazonaws.com/${process.env.CLIENTES_IDENTITY_POOL_ID}`]:
        await result.getIdToken().getJwtToken(),
    },
  });

  const accessToken = result.getAccessToken().getJwtToken();  
  return accessToken;
}

export { getToken };
