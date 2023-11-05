import { APIGatewayEvent } from 'aws-lambda';
import { UserConfirmationData, UserDataUserPoolType } from 'types/UserTypes';

import { authenticateCognitoUser } from '../middleware/provider/authenticateUser';
import { confirmUser } from '../middleware/provider/confirmUser';
import sendResponse from '../utils/sendResponse';
import validateAdminData from '../utils/validateEmail';

async function handler(event: APIGatewayEvent) {
  const { email, password } = JSON.parse(event.body as string);
  try {
    await validateAdminData(email, password);
  } catch (err: any) {
    console.error(err);
    return sendResponse(400, {errors: err.errors});
  }

  const adminData: UserConfirmationData = {
    Username: email,
    UserPoolId: process.env.ADMIN_POOL_ID
  }

  const adminPoolData: UserDataUserPoolType = {
    Username: email,
    Password: password,
    UserPoolId: process.env.ADMIN_POOL_ID,
    ClientId: process.env.ADMIN_POOL_CLIENT_ID,
    IdentityPoolId: process.env.ADMIN_IDENTITY_POOL_ID
  }

  try {
    await confirmUser(adminData);
    const result = await authenticateCognitoUser(adminPoolData);
    return sendResponse(200, result);
  } catch (err: any) {
    console.error(err);
    return sendResponse(400, { error: err.message });
  }
}

export { handler };
