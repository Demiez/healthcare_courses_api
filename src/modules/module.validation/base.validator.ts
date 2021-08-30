import { isBoolean, isNil, isNumber, isString } from 'lodash';
import { FieldIsBadModel } from '../../core/view-models';

const PROVIDE_VALUE_MESSAGE = 'Please provide value';

export class BaseValidator {
  protected static errors: Array<FieldIsBadModel>;

  protected static variableToString(variableObject: {}): string {
    return Object.keys(variableObject)[0];
  }

  protected static validateStringField(value: string, fieldName: string) {
    if (isNil(value)) {
      return new FieldIsBadModel(fieldName, PROVIDE_VALUE_MESSAGE);
    }

    if (!isString(value)) {
      return new FieldIsBadModel(fieldName, `Must be a string`);
    }
  }

  protected static validateNumberField(value: number, fieldName: string) {
    if (isNil(value)) {
      return new FieldIsBadModel(fieldName, PROVIDE_VALUE_MESSAGE);
    }

    if (!isNumber(value)) {
      return new FieldIsBadModel(fieldName, `Must be a number`);
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
