import { APIGatewayEvent } from 'aws-lambda';
import { IAuthUserRequest } from 'types/RequestTypes';

import { authClient } from '../middleware/provider/confirmUser';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';

async function handler (event: APIGatewayEvent) {
  const body: IAuthUserRequest = JSON.parse(event.body as string);
  const { cpf, password } = body;

  if (!validateCPF(cpf)) {
    return sendResponse(400, 'cpf inválido');
  }

  try {
    const token = await authClient(cpf, password);
    return sendResponse(200, { token });
  } catch (error: unknown) {
    console.log('error');
    console.log(error);
    return sendResponse(401, { mensagem: 'Falha na autenticar do usuario' });
  }
}

export { handler };
