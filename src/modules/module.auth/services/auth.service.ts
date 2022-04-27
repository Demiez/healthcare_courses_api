import 'reflect-metadata';
import { Service } from 'typedi';
import { BaseStatusesEnum } from '../../../core/enums';
import { ErrorCodes, UnauthorizedError } from '../../../core/errors';
import { StandardResponseViewModel } from '../../../core/view-models';
import { IUserDocument } from '../../module.user/db-models/user.db';
import {
  UserLoginRequestModel,
  UserRequestModel,
} from '../../module.user/models';
import { UserService } from '../../module.user/services/user.service';
import {
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  USER_REGISTERED,
} from '../constants/auth.messages';
import { JwtTokenViewModel } from '../models';

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
}
