import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { decode } from 'jsonwebtoken';

function getClientIdFromJwtToken(token: string): string {
  const decodedToken = decode(token, { json: true }) || { client_id: '' };
  return decodedToken.client_id;
}

async function validateToken(token: string): Promise<boolean> {
  const clientId = getClientIdFromJwtToken(token);
  const pool: string= process.env.CLIENTES_POOL_ID || '';
  const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: pool,
    tokenUse: 'access',
    clientId: clientId,
  });
  
  try {
    const payload = await jwtVerifier.verify(token);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { validateToken };
