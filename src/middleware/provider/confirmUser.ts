import { AdminGetUserCommand,CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { UserConfirmationData } from 'types/UserTypes';

const AWS_REGION = process.env.COGNITO_REGION ?? 'us-east-1';

async function confirmUser(userData: UserConfirmationData) {
  const client = new CognitoIdentityProviderClient({region: AWS_REGION});
  const input = {
    UserPoolId: userData.UserPoolId,
    Username: userData.Username,
  };
  const command = new AdminGetUserCommand(input);
  const response = await client.send(command);
  return response;  
}

export { confirmUser };
