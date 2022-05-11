import { createHash, randomBytes, scryptSync } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { IUserDocument } from '../../module.user/db-models/user.db';
import {
  DEFAULT_ALGORITHM,
  DEFAULT_ENCODING,
  HASH_KEY_LENGTH,
  HASH_SCRYPT_COST,
  RESET_PASSWORD_TOKEN_BYTE_LENGTH,
  RESET_PASSWORD_TOKEN_TIME,
  SALT_BYTE_LENGTH,
} from '../constants/auth.constants';
import { IResetPasswordTokenData } from '../interfaces/auth.interfaces';
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

export function getResetPasswordToken(): IResetPasswordTokenData {
  const userData = this as IUserDocument;

  const resetToken = randomBytes(RESET_PASSWORD_TOKEN_BYTE_LENGTH).toString(
    DEFAULT_ENCODING
  );

  const hashedResetToken = createHash(DEFAULT_ALGORITHM)
    .update(resetToken)
    .digest(DEFAULT_ENCODING);

  const resetPasswordExpiration = new Date(
    Date.now() + RESET_PASSWORD_TOKEN_TIME
  );

  userData.resetPasswordToken = hashedResetToken;
  userData.resetPasswordExpiration = resetPasswordExpiration;

  return {
    resetPasswordToken: hashedResetToken,
    resetPasswordExpiration,
  } as IResetPasswordTokenData;
}

export function matchPasswords(password: string): boolean {
  const hash = hashPassword(password, this.salt);

  return hash === this.password;
}
