import { APIGatewayEvent } from 'aws-lambda';

import { authClient } from '../middleware/provider/confirmUser';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';
import { IAuthUserRequest } from 'types/RequestTypes';

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
    return sendResponse(401, { mensagem: 'Falha au autenticar usuario' });
  }
}

export { handler };
