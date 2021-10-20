import { isBoolean, isInteger, isNil, isNumber, isString } from 'lodash';
import { FieldIsBadModel } from '../../../core/view-models';
import { BaseValidationMessagesEnum } from '../enums';

export abstract class BaseValidator {
  protected static errors: Array<FieldIsBadModel>;

  protected static validateStringField(
    value: string,
    fieldName: string,
    customProvideValueMessage?: string
  ) {
    if (!value) {
      return new FieldIsBadModel(
        fieldName,
        customProvideValueMessage
          ? customProvideValueMessage
          : BaseValidationMessagesEnum.PROVIDE_VALUE_MESSAGE
      );
    }

    if (!isString(value)) {
      return new FieldIsBadModel(
        fieldName,
        BaseValidationMessagesEnum.MUST_BE_STRING
      );
    }
  }

  protected static validateNumberField(
    value: number,
    fieldName: string,
    isIntegerValue?: boolean,
    customProvideValueMessage?: string
  ) {
    if (isNil(value)) {
      return new FieldIsBadModel(
        fieldName,
        customProvideValueMessage
          ? customProvideValueMessage
          : BaseValidationMessagesEnum.PROVIDE_VALUE_MESSAGE
      );
    }

    if (!isNumber(value)) {
      return new FieldIsBadModel(
        fieldName,
        BaseValidationMessagesEnum.MUST_BE_NUMBER
      );
    }

    if (isIntegerValue && !isInteger(value)) {
      return new FieldIsBadModel(
        fieldName,
        BaseValidationMessagesEnum.MUST_BE_INTEGER
      );
    }
  }

  protected static validateBooleanField(value: boolean, fieldName: string) {
    if (isNil(value)) {
      return new FieldIsBadModel(
        fieldName,
        BaseValidationMessagesEnum.PROVIDE_VALUE_MESSAGE
      );
    }

    if (!isBoolean(value)) {
      return new FieldIsBadModel(
        fieldName,
        BaseValidationMessagesEnum.MUST_BE_BOOLEAN
      );
    }
  }
}
