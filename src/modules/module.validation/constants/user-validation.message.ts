import { USER_NAME_LENGTH } from '../../module.user/constants/user.constants';

export const USER_INVALID_PASSWORD_P1 = 'Password must be minimum ';
export const USER_INVALID_PASSWORD_P2 =
  ' characters long with at least one lower letter, one uppercase letter, one digit, one special character';
export const USER_NAME_LENGTH_MESSAGE = `User name can't be more than ${USER_NAME_LENGTH} letters`;
export const USER_ROLE_VALID_VALUE_MESSAGE =
  'User role can only be of valid value';
export const USER_ID_VALID_VALUE_MESSAGE = 'User id must be a valid uuid';
export const USER_PASSWORD_UPDATE_MESSAGE =
  'User password can be updated only through reset password';
export const USER_ROLE_UPDATE_MESSAGE =
  'Only admin is allowed to change user role';
export const USER_ID_UPDATE_MESSAGE =
  'Only admin is allowed to update other user profile';
