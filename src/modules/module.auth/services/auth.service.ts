import 'reflect-metadata';
import { Service } from 'typedi';
import { BaseStatusesEnum } from '../../../core/enums';
import { StandardResponseViewModel } from '../../../core/view-models';
import { IUserDocument } from '../../module.user/db-models/user.db';
import { UserRequestModel } from '../../module.user/models/user.rm';
import { UserService } from '../../module.user/services/course.service';

@Service()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async registerUser(
    requestModel: UserRequestModel
  ): Promise<StandardResponseViewModel<IUserDocument>> {
    const user = await this.userService.createUser(requestModel);

    return new StandardResponseViewModel<IUserDocument>(
      user,
      'User registered',
      BaseStatusesEnum.OK
    );
  }
}
