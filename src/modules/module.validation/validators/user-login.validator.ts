import validator from 'validator';
import { passwordValidationRegex } from '../../../core/regex/validation.regex';
import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import { ALLOWED_PASSWORD_LENGTH } from '../../module.auth/constants/auth.constants';
import { UserLoginRequestModel } from '../../module.user/models';
import { VALID_EMAIL_MESSAGE } from '../constants';
import {
  USER_INVALID_PASSWORD_P1,
  USER_INVALID_PASSWORD_P2,
} from '../constants/user-validation.message';
import { BaseValidator } from './base.validator';

export class UserLoginValidator extends BaseValidator {
  public static validate(requestModel: UserLoginRequestModel) {
    this.errors = [];

    const { email, password } = requestModel;

    this.validateEmail(email, convertVariableToString({ email }));
    this.validatePassword(password, convertVariableToString({ password }));

    return this.errors;
  }

  private static validateEmail(email: string, fieldName: string) {
    const error = this.validateStringField(email, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    if (!validator.isEmail(email)) {
      this.errors.push(new FieldIsBadModel(fieldName, VALID_EMAIL_MESSAGE));
    }
  }

  private static validatePassword(password: string, fieldName: string) {
    const error = this.validateStringField(password, fieldName);

    if (error) {
      this.errors.push(error);
      return;
    }

    const regexSource = passwordValidationRegex.source;

    const validationRegex = new RegExp(
      regexSource.replace('(?=.{8,})', `(?=.{${ALLOWED_PASSWORD_LENGTH},})`)
    );

    if (!validationRegex.test(password)) {
      this.errors.push(
        new FieldIsBadModel(
          fieldName,
          USER_INVALID_PASSWORD_P1 +
            ALLOWED_PASSWORD_LENGTH +
            USER_INVALID_PASSWORD_P2
        )
      );
    }
  }
}
