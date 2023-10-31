import jwt from 'jsonwebtoken';
// import { error } = require('../../utils')

const createToken = (cpf: any) => {

  // TODO: VALIDADOR CPF

  try {
    const token = jwt.sign({ cpf }, 'HMAC', { expiresIn: "1y" });
    return token;
  } catch (err) {
    throw new Error('token não foi criado');
  }
}

export { createToken };
