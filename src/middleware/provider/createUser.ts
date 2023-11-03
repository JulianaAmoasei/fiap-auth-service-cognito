import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

import { ICognitoInput } from '../../types/CognitoInputTypes';

async function createUser (cpf: string) {

  const input: ICognitoInput = {
    UserPoolId: process.env.CLIENTES_POOL_ID || '',
    TemporaryPassword: '123456',
    Username: cpf,
    MessageAction: 'SUPPRESS',
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
 } catch (error: unknown) {
    console.error(error, 'deu algum erro');
    throw new Error(error as string);
  }
}

export { createUser };
