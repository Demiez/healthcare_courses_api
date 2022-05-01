import { isEmpty } from 'lodash';
import 'reflect-metadata';
import { Service } from 'typedi';
import {
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection } from '../../../core/interfaces';
import { UserLoginValidator } from '../../module.validation/validators/user-login.validator';
import { UserRequestModelValidator } from '../../module.validation/validators/user-rm.validator';
import { USER_NOT_FOUND_MESSAGE } from '../constants/user-messages.constants';
import { IUserDocument, UserModel } from '../db-models/user.db';
import { UserLoginRequestModel } from '../models';
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

  public async getUserByEmailWithPassword(
    email: string,
    projection: string | IProjection = {}
  ): Promise<IUserDocument> {
    return await UserModel.findOne({ email }, projection).select('+password');
  }

  public async tryGetUserById(
    userId: string,
    projection: string | IProjection = {}
  ): Promise<IUserDocument> {
    const user = await UserModel.findById(userId, projection);

    if (!user) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, [
        USER_NOT_FOUND_MESSAGE,
      ]);
    }

    return user;
  }

  public validateUserLoginData(requestModel: UserLoginRequestModel): void {
    const errors = UserLoginValidator.validate(requestModel);

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }
}
