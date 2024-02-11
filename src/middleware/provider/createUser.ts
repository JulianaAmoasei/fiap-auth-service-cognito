import {
  AdminCreateUserCommand,
  UpdateUserAttributesCommand,
  UpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserConfirmationData } from 'types/UserTypes';

import { ICognitoInput } from '../../types/CognitoInputTypes';
import { encryptPassword } from '../auth/encryptPassword';

const AWS_REGION = process.env.COGNITO_REGION ?? 'us-east-1';

async function addCustomAttributes(input: UpdateUserAttributesCommandInput) {
  const client = new CognitoIdentityProviderClient({region: AWS_REGION});    
  const command = new UpdateUserAttributesCommand(input);
  return await client.send(command);
}

async function createUser (userData: UserConfirmationData) {

  const input: ICognitoInput = {
    UserPoolId: userData.UserPoolId || '',
    TemporaryPassword: encryptPassword(userData.Username),
    Username: userData.Username,
    MessageAction: 'SUPPRESS',  
  };

  try {
    const client = new CognitoIdentityProviderClient({region: AWS_REGION});    
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    if (response.User?.Username) {
      return true
    } else {
      throw new Error('usuário não criado')
    }
 } catch (error: unknown) {
    console.error(error, 'deu algum erro');
    throw new Error(error as string);
  }
}

export { addCustomAttributes, createUser };
