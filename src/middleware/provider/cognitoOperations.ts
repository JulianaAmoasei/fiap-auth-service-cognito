import {
  AdminCreateUserCommand,
  UpdateUserAttributesCommand,
  UpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  DeleteUserAttributesCommand,
  DeleteUserAttributesCommandInput,
  DeleteUserCommand,
  DeleteUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserConfirmationData } from 'types/UserTypes';

import { ICognitoInput } from '../../types/CognitoInputTypes';
import { encryptPassword } from '../auth/encryptPassword';

const AWS_REGION = process.env.COGNITO_REGION ?? 'us-east-1';

const client = new CognitoIdentityProviderClient({region: AWS_REGION});    

async function deleteClient(input: DeleteUserCommandInput) {
  const command = new DeleteUserCommand(input);
  const response = await client.send(command);
  console.log(response);
}

async function removeCustomAttributes(input: DeleteUserAttributesCommandInput) {
  const command = new DeleteUserAttributesCommand(input);
  const response = await client.send(command);
  console.log(response);
}

async function addCustomAttributes(input: UpdateUserAttributesCommandInput) {
  const command = new UpdateUserAttributesCommand(input);
  return await client.send(command);
}

async function createUser (userData: UserConfirmationData) {

  const input: ICognitoInput = {
    UserPoolId: userData.UserPoolId ?? '',
    TemporaryPassword: encryptPassword(userData.Username),
    Username: userData.Username,
    MessageAction: 'SUPPRESS',  
  };

  try {
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    if (response.User?.Username) {
      return true
    } else {
      throw new Error('usuário não criado')
    }
 } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export { addCustomAttributes, createUser, deleteClient, removeCustomAttributes };
