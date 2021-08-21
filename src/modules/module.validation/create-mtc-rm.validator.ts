import validator from 'validator';
import { FieldIsBadModel } from '../../core/view-models';
import { CreateMtcRequestModel } from '../module.mtc/request-models';

export class CreateMtcRequestModelValidator {
  public static validate(requestModel: CreateMtcRequestModel) {
    const errors: Array<FieldIsBadModel> = [];

    if (!validator.isEmail(requestModel.email)) {
      errors.push(new FieldIsBadModel('email'));
    }

    return errors;
  }
}
