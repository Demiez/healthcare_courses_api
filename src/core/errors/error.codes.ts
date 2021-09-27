import { BaseErrorCodes } from './base-error-codes';

export class ErrorCodes extends BaseErrorCodes {
  public static get INTERNAL_SERVER_ERROR() {
    return 'INTERNAL_SERVER_ERROR';
  }

  public static get INVALID_INPUT_PARAMS() {
    return 'INVALID_INPUT_PARAMS';
  }

  public static get INVALID_AUTH_PARAMS() {
    return 'INVALID_AUTH_PARAMS';
  }

  public static get INVALID_AUTH_PARAMS_PASSWORD_INCORECT() {
    return 'INVALID_AUTH_PARAMS_PASSWORD_INCORECT';
  }

  public static get UNAUTHORIZED() {
    return 'UNAUTHORIZED';
  }

  public static get RECORD_NOT_FOUND() {
    return 'RECORD_NOT_FOUND';
  }

  public static get MONGO_DB_ERROR() {
    return 'MONGO_DB_ERROR';
  }

  public static get MTC_NAME_IS_ALREADY_REGISTERED() {
    return 'MTC_NAME_IS_ALREADY_REGISTERED';
  }

  public static get GEO_CODER_ERROR() {
    return 'GEO_CODER_ERROR';
  }
}
