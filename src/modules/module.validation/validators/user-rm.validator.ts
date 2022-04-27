import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import { USER_NAME_LENGTH } from '../../module.user/constants/user.constants';
import { UserRolesEnum } from '../../module.user/enums/user-roles.enum';
import { UserRequestModel } from '../../module.user/models';
import {
  USER_ID_VALID_VALUE_MESSAGE,
  USER_NAME_LENGTH_MESSAGE,
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
