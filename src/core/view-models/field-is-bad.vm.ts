import { BaseFieldErrorViewModel } from './base-field-error.vm';

export class FieldIsBadModel extends BaseFieldErrorViewModel {
  public field: string;
  public errorCode: string;
  public message?: string;

  constructor(field: string, message?: string) {
    super();
    this.field = field;
    this.message = message;
  }
}
