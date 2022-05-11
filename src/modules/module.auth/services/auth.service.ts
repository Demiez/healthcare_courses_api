import { Request } from 'express';
import 'reflect-metadata';
import { Service } from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { BaseStatusesEnum } from '../../../core/enums';
import {
  ErrorCodes,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../../core/errors';
import { StandardResponseViewModel } from '../../../core/view-models';
import { EmailService } from '../../module.email/services/email.service';
import { USER_NOT_FOUND_MESSAGE } from '../../module.user/constants/user-messages.constants';
import { IUserDocument } from '../../module.user/db-models/user.db';
import {
  UserLoginRequestModel,
  UserPasswordRequestModel,
  UserRequestModel,
  UserViewModel,
} from '../../module.user/models';
import { UserService } from '../../module.user/services/user.service';
import {
  CURRENT_USER,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  PASSWORD_RESET,
  RESET_PASSWORD_EMAIL_SENT,
  RESET_PASSWORD_INVALID_TOKEN,
  RESET_PASSWORD_SUCCESS,
  USER_REGISTERED,
} from '../constants/auth-messages.constants';
import { IResetPasswordTokenData } from '../interfaces/auth.interfaces';
import { JwtTokenViewModel } from '../models';
import { ResetPasswordTokenViewModel } from '../models/reset-password-token.vm';

@Service()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

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
    requestModel: UserLoginRequestModel,
    req: Request
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
    const message = this.createResetPasswordMessage(resetTokenData, req);

    try {
      await this.emailService.sendEmail(email, PASSWORD_RESET, message);
    } catch (error) {
      throw new InternalServerError(ErrorCodes.EMAIL_SENDER_ERROR, [
        error.message,
      ]);
    }

    await user.save();

    return new StandardResponseViewModel(
      new ResetPasswordTokenViewModel(email, resetTokenData),
      RESET_PASSWORD_EMAIL_SENT,
      BaseStatusesEnum.OK
    );
  }

  public async resetPassword(
    resetToken: string,
    requestModel: UserPasswordRequestModel
  ): Promise<[IUserDocument, StandardResponseViewModel<JwtTokenViewModel>]> {
    const user = await this.userService.getUserByResetToken(resetToken);

    if (!user) {
      throw new ForbiddenError(ErrorCodes.INVALID_AUTH_PARAMS, [
        RESET_PASSWORD_INVALID_TOKEN,
      ]);
    }

    this.userService.validateUserPasswordData(requestModel.password);

    user.password = requestModel.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    await user.save();

    return [
      user,
      new StandardResponseViewModel(
        {} as JwtTokenViewModel,
        RESET_PASSWORD_SUCCESS,
        BaseStatusesEnum.OK
      ),
    ];
  }

  private createResetPasswordMessage(
    resetTokenData: IResetPasswordTokenData,
    req: Request
  ): string {
    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host'
    )}${APP_ROOT}/reset-password/${resetTokenData.resetPasswordToken}`;

    const message = `You are receiving this email due to the fact that you have requested a password reset. Please make a request to: \n\n ${resetPasswordUrl}`;

    return message;
  }
}
