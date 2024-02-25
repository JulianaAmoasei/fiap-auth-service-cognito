import { ListUsersCommand, AdminGetUserCommand, CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { UserConfirmationData } from 'types/UserTypes';

const AWS_REGION = process.env.COGNITO_REGION ?? 'us-east-1';

async function confirmUser(userData: UserConfirmationData) {
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });
  const input = {
    UserPoolId: userData.UserPoolId,
    Username: userData.Username,
  };
  const command = new AdminGetUserCommand(input);
  return await client.send(command);
}

async function searchUserBySub(input: ListUsersCommandInput) {
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });
  console.log(input)
  const command = new ListUsersCommand(input);
  const response = await client.send(command);
  return response;
}

async function authClient(username: string, password: string) {
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

  const authParams: InitiateAuthCommandInput = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  const authCommand = new InitiateAuthCommand(authParams);
  const authResponse = await client.send(authCommand);
  console.log('Token de acesso:', authResponse?.AuthenticationResult?.AccessToken);
  return authResponse?.AuthenticationResult?.AccessToken;
}

export { authClient, confirmUser, searchUserBySub };
