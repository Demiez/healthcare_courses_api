import { isEmpty } from 'lodash';
import 'reflect-metadata';
import { Service } from 'typedi';
import { BaseStatusesEnum } from '../../../core/enums';
import { ErrorCodes, ForbiddenError } from '../../../core/errors';
import { StandardResponseViewModel } from '../../../core/view-models';
import {
  UserLoginRequestModel,
  UserRequestModel,
} from '../../module.user/models';
import { UserService } from '../../module.user/services/user.service';
import { UserLoginValidator } from '../../module.validation/validators/user-login.validator';
import { JwtTokenViewModel } from '../models';

@Service()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async registerUser(
    requestModel: UserRequestModel
  ): Promise<StandardResponseViewModel<JwtTokenViewModel>> {
    const user = await this.userService.createUser(requestModel);

    const token = user.getSignedJwtToken();

    return new StandardResponseViewModel<JwtTokenViewModel>(
      new JwtTokenViewModel(token),
      'User registered',
      BaseStatusesEnum.OK
    );
  }

  public async loginUser(
    requestModel: UserLoginRequestModel
  ): Promise<StandardResponseViewModel<JwtTokenViewModel | {}>> {
    const errors = UserLoginValidator.validate(requestModel);

    if (!isEmpty(errors)) {
      throw new ForbiddenError(ErrorCodes.INVALID_INPUT_PARAMS, errors);
    }

    return new StandardResponseViewModel<{}>(
      {},
      'User registered',
      BaseStatusesEnum.OK
    );
  }
}
