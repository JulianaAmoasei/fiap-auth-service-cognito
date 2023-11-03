import { APIGatewayEvent } from 'aws-lambda';

import { authenticateCognitoUser } from '../middleware/provider/authenticateUser';
import { confirmUser } from '../middleware/provider/confirmUser';
import { createUser } from '../middleware/provider/createUser';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';

async function signUpUser (event: APIGatewayEvent) {
  const { cpf } = JSON.parse(event.body as string);
  if (!validateCPF(cpf)) {
    return sendResponse(400, 'CPF inválido');
  }

  try {
    await confirmUser(cpf);
    const result = await authenticateCognitoUser(cpf);
    return sendResponse(200, result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      await createUser(cpf);
      const result = await authenticateCognitoUser(cpf);
      return sendResponse(200, result);
    } else {
      throw new Error(error as string);
    }
  }
}

export { signUpUser };
