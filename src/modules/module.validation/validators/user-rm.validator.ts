import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import { USER_NAME_LENGTH } from '../../module.user/constants/user.constants';
import { UserRolesEnum } from '../../module.user/enums/user-roles.enum';
import { UserRequestModel } from '../../module.user/models';
import {
  USER_ID_UPDATE_MESSAGE,
  USER_ID_VALID_VALUE_MESSAGE,
  USER_NAME_LENGTH_MESSAGE,
  USER_PASSWORD_UPDATE_MESSAGE,
  USER_ROLE_UPDATE_MESSAGE,
  USER_ROLE_VALID_VALUE_MESSAGE,
} from '../constants/user-validation.message';
import { UserLoginValidator } from './user-login.validator';

export class UserRequestModelValidator extends UserLoginValidator {
  public static validate(requestModel: UserRequestModel) {
    this.errors = [];

    const { id, name, email, password, role } = requestModel;

    this.validateName(name, convertVariableToString({ name }));
    this.validateEmail(email, convertVariableToString({ email }));
    this.validatePassword(password, convertVariableToString({ password }));
    this.validateRole(role, convertVariableToString({ role }));

    if (id) {
      this.validateId(id, convertVariableToString({ id }));
    }

    return this.errors;
  }

  public static validateForUpdate(
    requestModel: UserRequestModel,
    isAdmin: boolean
  ) {
    this.errors = [];

    const { name, email } = requestModel;

    this.checkAdminOnlyFieldsForUpdate(requestModel, isAdmin);

    if (name) {
      this.validateName(name, convertVariableToString({ name }));
    }

    if (email) {
      this.validateEmail(email, convertVariableToString({ email }));
    }

    return this.errors;
  }

  private static checkAdminOnlyFieldsForUpdate(
    requestModel: UserRequestModel,
    isAdmin: boolean
  ) {
    const { id, password, role } = requestModel;

    if (!isAdmin) {
      if (id) {
        this.errors.push(new FieldIsBadModel('id', USER_ID_UPDATE_MESSAGE));
      }

      if (password) {
        this.errors.push(
          new FieldIsBadModel('password', USER_PASSWORD_UPDATE_MESSAGE)
        );
      }

      if (role) {
        this.errors.push(new FieldIsBadModel('role', USER_ROLE_UPDATE_MESSAGE));
      }

      return;
    }

    if (id) {
      this.validateId(id, convertVariableToString({ id }));
    }

    if (role) {
      this.validateRole(role, convertVariableToString({ role }));
    }

    if (password) {
      this.validatePassword(password, convertVariableToString({ password }));
    }
  }

  private static validateName(name: string, fieldName: string) {
    const error = this.validateStringField(name, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (name.length > USER_NAME_LENGTH) {
      this.errors.push(
        new FieldIsBadModel(fieldName, USER_NAME_LENGTH_MESSAGE)
      );
    }
  }

  private static validateRole(role: UserRolesEnum, fieldName: string) {
    const error = this.validateStringField(role, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!Object.values(UserRolesEnum).includes(role)) {
      this.errors.push(
        new FieldIsBadModel(fieldName, USER_ROLE_VALID_VALUE_MESSAGE)
      );
    }
  }

  private static validateId(id: string, fieldName: string) {
    const error = this.validateStringField(id, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!this.validateUuidString(id)) {
      this.errors.push(
        new FieldIsBadModel(fieldName, USER_ID_VALID_VALUE_MESSAGE)
      );
    }
  }
}
