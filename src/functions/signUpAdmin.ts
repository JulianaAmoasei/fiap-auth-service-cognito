import { APIGatewayEvent } from 'aws-lambda';
import { UserConfirmationData, UserDataUserPoolType } from 'types/UserTypes';
import validateAdminData from '../utils/validateEmail';

import { authenticateCognitoUser } from '../middleware/provider/authenticateUser';
import { confirmUser } from '../middleware/provider/confirmUser';
import { createUser } from '../middleware/provider/createUser';
import sendResponse from '../utils/sendResponse';

async function handler (event: APIGatewayEvent) {
  const { email } = JSON.parse(event.body as string);
  
  if (!validateAdminData(email)) {
    return sendResponse(400, 'formato de email inválido');
  }

  const adminData: UserConfirmationData = {
    Username: email,
    UserPoolId: process.env.ADMIN_POOL_ID
  }

  const adminPoolData: UserDataUserPoolType = {
    Username: email,
    UserPoolId: process.env.ADMIN_POOL_ID,
    ClientId: process.env.ADMIN_POOL_CLIENT_ID,
    IdentityPoolId: process.env.ADMIN_IDENTITY_POOL_ID
  }

  try {
    await confirmUser(adminData);
    const result = await authenticateCognitoUser(adminPoolData);
    return sendResponse(200, result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      await createUser(adminData);
      const result = await authenticateCognitoUser(adminPoolData);
      return sendResponse(200, result);
    } else {
      throw new Error(error as string);
    }
  }
}

export { handler };
