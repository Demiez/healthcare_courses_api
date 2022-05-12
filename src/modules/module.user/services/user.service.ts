import { isEmpty } from 'lodash';
import 'reflect-metadata';
import { Service } from 'typedi';
import {
  BaseErrorSubCodes,
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection } from '../../../core/interfaces';
import { UserLoginValidator } from '../../module.validation/validators/user-login.validator';
import { UserRequestModelValidator } from '../../module.validation/validators/user-rm.validator';
import {
  ADMIN_USER_REGISTRATION_MESSAGE,
  USER_EMAIL_TAKEN_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../constants/user-messages.constants';
import { IUserDocument, UserModel } from '../db-models/user.db';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { UserLoginRequestModel, UserViewModel } from '../models';
import { UserRequestModel } from '../models/user.rm';

@Service()
export class UserService {
  public async createUser(userData: UserRequestModel): Promise<IUserDocument> {
    this.validateUserData(userData);

    if (userData.role === UserRolesEnum.ADMIN) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, [
        ADMIN_USER_REGISTRATION_MESSAGE,
      ]);
    }

    return await UserModel.create(userData);
  }

  public async getUserByEmailWithPassword(
    email: string,
    projection: string | IProjection = {}
  ): Promise<IUserDocument> {
    return await UserModel.findOne({ email }, projection).select('+password');
  }

  public async getUserByEmail(
    email: string,
    projection: string | IProjection = {}
  ): Promise<IUserDocument> {
    return await UserModel.findOne({ email }, projection);
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

  public async updateUser(
    userData: UserRequestModel,
    user: IUserDocument
  ): Promise<UserViewModel> {
    this.validateUserData(userData, true, user.role === UserRolesEnum.ADMIN);

    if (userData.email && userData.email !== user.email) {
      const existingUserByEmail = await this.getUserByEmail(
        userData.email,
        'email'
      );

      if (existingUserByEmail) {
        throw new ForbiddenError(
          BaseErrorSubCodes.INVALID_INPUT_PARAMS_IS_DUPLICATE_VALUE,
          [USER_EMAIL_TAKEN_MESSAGE]
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(user.id, userData, {
      new: true,
    });

    return new UserViewModel(updatedUser);
  }

  public async getUserByResetToken(resetToken: string): Promise<IUserDocument> {
    return await UserModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiration: { $gte: Date.now() },
    });
  }

  public validateUserLoginData(
    requestModel: UserLoginRequestModel,
    isEmailOnlyValidation?: boolean
  ): void {
    const errors = UserLoginValidator.validate(
      requestModel,
      isEmailOnlyValidation
    );

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  public validateUserPasswordData(password: string): void {
    const errors = UserLoginValidator.validatePasswordData(password);

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private validateUserData(
    userData: UserRequestModel,
    isUpdate?: boolean,
    isAdmin?: boolean
  ): void {
    const errors = isUpdate
      ? UserRequestModelValidator.validateForUpdate(userData, isAdmin)
      : UserRequestModelValidator.validate(userData);

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }
}
