export interface IUserAttributes {
  address?: string,
  email?: string,
  phone_number?: string,
  nickname?: string
}

export interface IUserRequest {
  cpf: string,
  attributes?: IUserAttributes
}