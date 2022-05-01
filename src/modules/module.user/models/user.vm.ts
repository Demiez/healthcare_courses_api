import { keys, pick } from 'lodash';
import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { IUserDocument } from '../db-models/user.db';
import { UserRolesEnum } from '../enums/user-roles.enum';

@ApiModel({
  name: 'UserViewModel',
  description: 'User View Model',
})
export class UserViewModel {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    example: '00000000-1234-abcd-0000-000000000000' as any,
  })
  public id: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public name: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public email: string = undefined;

  @ApiModelProperty({
    itemType: SwaggerDefinitionConstant.STRING,
    enum: Object.values(UserRolesEnum),
    required: true,
  })
  public role: UserRolesEnum = undefined;

  constructor(body: IUserDocument) {
    const pickedBody = pick(body, keys(this));

    Object.assign(this, pickedBody);
  }
}
