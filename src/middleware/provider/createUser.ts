import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoInputType } from "types/CognitoInputType";

async function createUser (cpf:any) {
 
  const input: CognitoInputType = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: cpf,
    MessageAction: "SUPPRESS",
  };

  try {
    const client = new CognitoIdentityProviderClient({region: 'us-east-1'});    
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    if (response.User?.Username) {
      return true
    } else {
      throw new Error('usuário não criado')
    }
 } catch (error:any) {
    console.error(error, 'deu algum erro');
    throw new Error(error);
  }
};

export { createUser };
