import { randomBytes, scryptSync } from 'crypto';
import {
  DEFAULT_ENCODING,
  HASH_KEY_LENGTH,
  HASH_SCRYPT_COST,
  SALT_BYTE_LENGTH,
} from '../constants/auth.constants';

export const generateSalt = (): string =>
  randomBytes(SALT_BYTE_LENGTH).toString(DEFAULT_ENCODING);

export const hashPassword = (password: string, salt: string): string => {
  return scryptSync(password, salt, HASH_KEY_LENGTH, {
    N: HASH_SCRYPT_COST,
  }).toString(DEFAULT_ENCODING);
};
