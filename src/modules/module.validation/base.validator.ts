import { isBoolean } from 'lodash';
import { FieldIsBadModel } from '../../core/view-models';

export class BaseValidator {
  protected static errors: Array<FieldIsBadModel>;

  protected static validateBooleanField(value: boolean, name: string) {
    if (!isBoolean(value)) {
      this.errors.push(new FieldIsBadModel(name));
    }
  }
}
