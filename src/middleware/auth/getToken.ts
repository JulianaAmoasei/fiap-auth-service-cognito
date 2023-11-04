import { CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

async function getToken(result: CognitoUserSession, identityPool: string | undefined) {
  AWS.config.region = 'us-east-1';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool || '',
    Logins: {
      [`cognito-idp.us-east-1.amazonaws.com/${identityPool}`]:
        await result.getIdToken().getJwtToken(),
    },
  });

  const accessToken = result.getAccessToken().getJwtToken();  
  return accessToken;
}

export { getToken };
