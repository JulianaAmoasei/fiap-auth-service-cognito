import { AdminGetUserCommand,CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

async function confirmUser(cpf: string) {
  const client = new CognitoIdentityProviderClient({region: 'us-east-1'});
  const input = {
    UserPoolId: process.env.CLIENTES_POOL_ID,
    Username: cpf,
  };
  const command = new AdminGetUserCommand(input);
  const response = await client.send(command);
  return response;  
}

export { confirmUser };
