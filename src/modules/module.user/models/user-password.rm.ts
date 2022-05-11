import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';

@ApiModel({
  name: 'UserPasswordRequestModel',
  description: 'User Password Request Model for reset functionality',
})
export class UserPasswordRequestModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public password: string = undefined;

  constructor(body: UserPasswordRequestModel) {
    this.password = body.password;
  }
}
