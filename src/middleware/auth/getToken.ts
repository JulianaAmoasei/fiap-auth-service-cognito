import * as AWS from "aws-sdk/global";

async function getToken(result:any) {
  AWS.config.region = "us-east-1";

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID || "",
    Logins: {
      [`cognito-idp.us-east-1.amazonaws.com/${process.env.CLIENTES_IDENTITY_POOL_ID}`]:
        await result.getIdToken().getJwtToken(),
    },
  });

  const accessToken = await result.getAccessToken().getJwtToken();  
  return accessToken;
}

export { getToken };
