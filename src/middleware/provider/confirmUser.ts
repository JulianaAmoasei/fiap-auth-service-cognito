import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

async function confirmUser(cpf:any) {
  const client = new CognitoIdentityProviderClient({region: 'us-east-1'});
  const input = {
    UserPoolId: process.env.CLIENTES_POOL_ID,
    Username: cpf,
  };

  const command = new AdminGetUserCommand(input);
  const response = await client.send(command);
  console.log(response);
  return response;  
}

export { confirmUser };
