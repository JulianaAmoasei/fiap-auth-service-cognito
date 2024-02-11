import { APIGatewayEvent } from 'aws-lambda';
import { UserConfirmationData, UserDataUserPoolType } from 'types/UserTypes';

import { authenticateCognitoUser } from '../middleware/provider/authenticateUser';
import { confirmUser } from '../middleware/provider/confirmUser';
import { createUser } from '../middleware/provider/createUser';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';
import { IUserRequest } from 'types/RequestTypes';

async function handler (event: APIGatewayEvent) {
  const body: IUserRequest = JSON.parse(event.body as string);
  const { cpf } = body;
  const { attributes } = body;

  if (!validateCPF(cpf)) {
    return sendResponse(400, 'cpf inválido');
  }

  const clientData: UserConfirmationData = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID
  }

  const clientPoolData: UserDataUserPoolType = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID,
    ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
    IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID,
  }

  try {
    await confirmUser(clientData);
    const token = await authenticateCognitoUser(clientPoolData, attributes);
    return sendResponse(200, token);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      await createUser(clientData);
      const token = await authenticateCognitoUser(clientPoolData, attributes);
      return sendResponse(200, { token });
    } else {
      throw new Error(error as string);
    }
  }
}

export { handler };
