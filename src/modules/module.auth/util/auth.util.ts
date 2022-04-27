import { randomBytes, scryptSync } from 'crypto';
import * as jwt from 'jsonwebtoken';
import {
  DEFAULT_ENCODING,
  HASH_KEY_LENGTH,
  HASH_SCRYPT_COST,
  SALT_BYTE_LENGTH,
} from '../constants/auth.constants';
import { JwtPayloadDataModel } from '../models/jwt-payload.dm';

const { JWT_SECRET, JWT_EXPIRE } = process.env;

export const generateSalt = (): string =>
  randomBytes(SALT_BYTE_LENGTH).toString(DEFAULT_ENCODING);

export const hashPassword = (password: string, salt: string): string => {
  return scryptSync(password, salt, HASH_KEY_LENGTH, {
    N: HASH_SCRYPT_COST,
  }).toString(DEFAULT_ENCODING);
};

export function getSignedJwtToken(): string {
  return jwt.sign({ userId: this._id } as JwtPayloadDataModel, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}

export function matchPasswords(password: string): boolean {
  const hash = hashPassword(password, this.salt);

  return hash === this.password;
}
