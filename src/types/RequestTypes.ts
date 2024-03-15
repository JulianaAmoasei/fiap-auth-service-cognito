export interface IUserAttributes {
  address?: string,
  email?: string,
  phone_number?: string,
  nickname?: string
}


export interface IAuthUserRequest {
  cpf: string,
  password: string
}

export interface IUserRequest extends IAuthUserRequest {
  attributes?: IUserAttributes
}

export interface IUserRemoveRequest extends IAuthUserRequest {
  removeUser: boolean
}