import 'reflect-metadata';
import { Service } from 'typedi';
import { IUserDocument, UserModel } from '../db-models/user.db';
import { UserRequestModel } from '../models/user.rm';

@Service()
export class UserService {
  public async createUser(userData: UserRequestModel): Promise<IUserDocument> {
    return await UserModel.create(userData);
  }
}
