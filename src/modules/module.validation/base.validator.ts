import { isBoolean, isInteger, isNil, isNumber, isString } from 'lodash';
import { FieldIsBadModel } from '../../core/view-models';

const PROVIDE_VALUE_MESSAGE = 'Please provide value';

export class BaseValidator {
  protected static errors: Array<FieldIsBadModel>;

  protected static validateStringField(value: string, fieldName: string) {
    if (isNil(value)) {
      return new FieldIsBadModel(fieldName, PROVIDE_VALUE_MESSAGE);
    }

    if (!isString(value)) {
      return new FieldIsBadModel(fieldName, `Must be a string`);
    }
  }

  protected static validateNumberField(
    value: number,
    fieldName: string,
    isIntegerValue?: boolean
  ) {
    if (isNil(value)) {
      return new FieldIsBadModel(fieldName, PROVIDE_VALUE_MESSAGE);
    }

    if (!isNumber(value)) {
      return new FieldIsBadModel(fieldName, `Must be a number`);
    }

    if (isIntegerValue && !isInteger(value)) {
      return new FieldIsBadModel(fieldName, `Must be an integer`);
    }
  }

  protected static validateBooleanField(value: boolean, fieldName: string) {
    if (isNil(value)) {
      return new FieldIsBadModel(fieldName, PROVIDE_VALUE_MESSAGE);
    }

    if (!isBoolean(value)) {
      return new FieldIsBadModel(fieldName, `Must be a boolean`);
    }
  }
}
