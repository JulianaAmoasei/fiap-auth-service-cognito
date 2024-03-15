import { APIGatewayEvent } from 'aws-lambda';

import sendResponse from '../utils/sendResponse';
import { IUserRemoveRequest } from 'types/RequestTypes';
import { USER_ATTRIBUTES } from '../utils/attributesList';
import { deleteClient, removeCustomAttributes } from '../middleware/provider/cognitoOperations';

async function handler(event: APIGatewayEvent) {
  try {
    const { authorization } = event.headers;
    if (!authorization) {
      return sendResponse(401, { mensagem: `Token nao fornecido` });
    }

    const token = authorization?.split(' ')[1];

    const body: IUserRemoveRequest = JSON.parse(event.body as string);
    const { removeUser } = body;

    if (removeUser) {
      await deleteClient({
        AccessToken: token,
      })

      return sendResponse(200, { mensagem: `Seu usuario foi apagado do sistema!` });
    }
    await removeCustomAttributes({
      AccessToken: token,
      UserAttributeNames: USER_ATTRIBUTES
    })
    return sendResponse(200, { mensagem: `${USER_ATTRIBUTES} foram removidos do seu cadastro!` });
  } catch (err: unknown) {
    console.log(err);
  }
  return sendResponse(400, { mensagem: `Nao foi possivel realizar operacao` });
}

export { handler };
