import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import sendResponse from "../utils/sendResponse";
import { CognitoInputType } from "types/CognitoInputType";

async function signUpUser (event: any) {
  const { cpf } = JSON.parse(event.body);
  
  const input: CognitoInputType = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: cpf,
    MessageAction: "SUPPRESS",
  };

  try {
    const client = new CognitoIdentityProviderClient({region: 'us-east-1'});    
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    return sendResponse(200, { response });
 } catch (error) {
    console.error(error, 'deu algum erro');
    return sendResponse(400, error);
  }
};

export { signUpUser };
