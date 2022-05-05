import 'reflect-metadata';
import { Service } from 'typedi';
import { BaseStatusesEnum } from '../../../core/enums';
import {
  ErrorCodes,
  NotFoundError,
  UnauthorizedError,
} from '../../../core/errors';
import { StandardResponseViewModel } from '../../../core/view-models';
import { USER_NOT_FOUND_MESSAGE } from '../../module.user/constants/user-messages.constants';
import { IUserDocument } from '../../module.user/db-models/user.db';
import {
  UserLoginRequestModel,
  UserRequestModel,
  UserViewModel,
} from '../../module.user/models';
import { UserService } from '../../module.user/services/user.service';
import {
  CURRENT_USER,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  USER_REGISTERED,
} from '../constants/auth.messages';
import { JwtTokenViewModel } from '../models';
import { ResetPasswordTokenViewModel } from '../models/reset-password-token.vm';

@Service()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async registerUser(
    requestModel: UserRequestModel
  ): Promise<[IUserDocument, StandardResponseViewModel<JwtTokenViewModel>]> {
    const user = await this.userService.createUser(requestModel);

    return [
      user,
      new StandardResponseViewModel(
        {} as JwtTokenViewModel,
        USER_REGISTERED,
        BaseStatusesEnum.OK
      ),
    ];
  }

  public async loginUser(
    requestModel: UserLoginRequestModel
  ): Promise<[IUserDocument, StandardResponseViewModel<JwtTokenViewModel>]> {
    this.userService.validateUserLoginData(requestModel);

    const { email, password } = requestModel;

    const user = await this.userService.getUserByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedError(ErrorCodes.INVALID_AUTH_PARAMS, [
        INVALID_CREDENTIALS,
      ]);
    }

    const isPasswordMatch = user.matchPasswords(password);

    if (!isPasswordMatch) {
      throw new UnauthorizedError(ErrorCodes.INVALID_AUTH_PARAMS, [
        INVALID_CREDENTIALS,
      ]);
    }

    return [
      user,
      new StandardResponseViewModel(
        {} as JwtTokenViewModel,
        LOGIN_SUCCESSFUL,
        BaseStatusesEnum.OK
      ),
    ];
  }

  public getCurrentUser(
    user: IUserDocument
  ): StandardResponseViewModel<UserViewModel> {
    return new StandardResponseViewModel(
      new UserViewModel(user),
      CURRENT_USER,
      BaseStatusesEnum.OK
    );
  }

  public async processForgotPassword(
    requestModel: UserLoginRequestModel
  ): Promise<StandardResponseViewModel<ResetPasswordTokenViewModel>> {
    this.userService.validateUserLoginData(requestModel, true);

    const { email } = requestModel;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, [
        USER_NOT_FOUND_MESSAGE + ` by provided email: ${email}`,
      ]);
    }

    const resetTokenData = user.getResetPasswordToken();

    await user.save();

    return new StandardResponseViewModel(
      new ResetPasswordTokenViewModel(email, resetTokenData),
      LOGIN_SUCCESSFUL,
      BaseStatusesEnum.OK
    );
  }
}
