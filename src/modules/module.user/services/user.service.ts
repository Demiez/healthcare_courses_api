import { isEmpty } from 'lodash';
import 'reflect-metadata';
import { Service } from 'typedi';
import { ErrorCodes, ForbiddenError } from '../../../core/errors';
import { UserRequestModelValidator } from '../../module.validation/validators/user-rm.validator';
import { IUserDocument, UserModel } from '../db-models/user.db';
import { UserRequestModel } from '../models/user.rm';

@Service()
export class UserService {
  public async createUser(userData: UserRequestModel): Promise<IUserDocument> {
    const errors = UserRequestModelValidator.validate(userData);

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }

    return await UserModel.create(userData);
  }
}
