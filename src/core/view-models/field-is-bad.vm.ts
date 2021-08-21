import { BaseFieldErrorViewModel } from './base-field-error.vm';

export class FieldIsBadModel extends BaseFieldErrorViewModel {
  public field: string;
  public errorCode: string;

  constructor(field: string) {
    super();
    this.field = field;
  }
}
