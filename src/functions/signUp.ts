const {
  CognitoIdentityProviderClient
} = require("@aws-sdk/client-cognito-identity-provider");
const sendResponse = require("../utils/sendResponse");
const dotenv = require('dotenv');

const cognito = new CognitoIdentityProviderClient({ region: "us-east-1" });

dotenv.config();

module.exports.signUpUser = async (event: any) => {
  try {
    const { name, email, password } = JSON.parse(event.body);

    const result = await cognito.adminCreateUser({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
      ],
      MessageAction: "SUPPRESS",
    }).promise();

    if (result.User) {
      await cognito.adminSetUserPassword({
        Password: password,
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        Permanent: true,
      }).promise();
    }

    return sendResponse(200, { result });
  } catch (error) {
    console.error(error, 'deu algum erro');
    return sendResponse(400, error);
  }
};
