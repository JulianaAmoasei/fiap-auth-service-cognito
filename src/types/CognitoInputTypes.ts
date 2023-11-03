import { DeliveryMediumType } from '@aws-sdk/client-cognito-identity-provider';
import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import { AdminCreateUserRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export type AuthenticationDataType = {
  Username: string;
  Password: string;
}

export type MessageActionType = {
  readonly RESEND: 'RESEND';
  readonly SUPPRESS: 'SUPPRESS';
};

export interface ICognitoInput extends AdminCreateUserRequest {
  UserPoolId: string;
  TemporaryPassword: string;
  Username: string;
  MessageAction?: 'RESEND' | 'SUPPRESS' | undefined;
  DesiredDeliveryMediums?: DeliveryMediumType[];
}

export interface IPoolData extends ICognitoUserPoolData {
  UserPoolId: string;
  ClientId: string;
}
