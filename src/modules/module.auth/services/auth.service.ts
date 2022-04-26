import 'reflect-metadata';
import { Service } from 'typedi';
import { BaseStatusesEnum } from '../../../core/enums';
import { StandardResponseViewModel } from '../../../core/view-models';
import { UserRequestModel } from '../../module.user/models/user.rm';
import { UserService } from '../../module.user/services/course.service';
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
}
