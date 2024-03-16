import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda';
import jwt from 'jsonwebtoken';


const USER_POOL_ID = process.env.CLIENTES_POOL_ID as string;
const POOL_CLIENT_CLIENT_ID = process.env.CLIENTES_IDENTITY_POOL_ID as string;
const POOL_ADMIN_CLIENT_ID = process.env.ADMIN_IDENTITY_POOL_ID as string;

interface DecodedToken {
  sub: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  username: string;
}

const ADMIN_ENDPOINTS = [
  'GET/api/pedido/iniciar-preparo',
  'GET/api/pedido/finalizar-preparo',
  'GET/api/pedido/entregar-pedido',
  'PUT/api/produto',
  'POST/api/produto',
  'DELETE/api/produto',
  'PUT/api/categoria',
  'POST/api/categoria',
  'DELETE/api/categoria',
];

async function validateToken(
  userPoolId: string,
  clientId: string,
  token: string
): Promise<string> {
  const verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'access',
    clientId,
  });

  const payload = await verifier.verify(token);
  return payload.sub;
}

async function handler(event: APIGatewayRequestAuthorizerEventV2) {
  const response = {
    isAuthorized: false,
    context: {
      typeUser: '',
      'x-client-id': ''
    },
  };

  try {
    console.log(event);
    const path = event.rawPath;
    const { method } = event.requestContext.http;

    const authorization = event?.headers?.authorization;

    if (!authorization) {
      return response;
    }

    const token = authorization?.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodedToken;

    if (!decodedToken) {
      return response;
    }

    console.log(`Decoded Token: ${JSON.stringify(decodedToken)}`);
    response.context['x-client-id'] = decodedToken.client_id;

    const PoolRegex = /([^/]+)$/;
    const getPoolIdMatch = decodedToken?.iss?.match(PoolRegex);
    if (!getPoolIdMatch) {
      return response;
    }

    const getPoolId = getPoolIdMatch[1];
    validateToken(
      getPoolId,
      getPoolId === USER_POOL_ID ? POOL_CLIENT_CLIENT_ID : POOL_ADMIN_CLIENT_ID,
      token
    );

    response.context.typeUser =  getPoolId === USER_POOL_ID ? 'CLIENT' : 'ADMIN';

    console.log(`${method}${path}`)
    const isAdmEndpoint = ADMIN_ENDPOINTS.some((endpoint) =>
      new RegExp(endpoint).test(`${method}${path}`)
    );
    console.log(`if client:  ${getPoolId === USER_POOL_ID}`)
    console.log(`isAdmEndpoint: ${isAdmEndpoint}`);

    if (getPoolId === USER_POOL_ID && isAdmEndpoint) {
      return response;
    }

    response.isAuthorized = true;
    return response;
  } catch (err) {
    console.log(err);
  }
  response.isAuthorized = false;
  return response;
}

export { handler };
