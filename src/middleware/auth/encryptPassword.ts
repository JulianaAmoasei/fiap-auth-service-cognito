import { createHash } from 'crypto';

function encryptPassword(cpf: string): string {
  const hash = createHash('md5');
  hash.update(cpf);
  return hash.digest('hex');
}

export { encryptPassword };
