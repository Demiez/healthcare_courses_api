import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';

@ApiModel({
  name: 'UserLoginRequestModel',
  description: 'User Login Request Model',
})
export class UserLoginRequestModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public email: string = undefined;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING })
  public password?: string = undefined;

  constructor(body: UserLoginRequestModel) {
    this.email = body.email;
    this.password = body.password;
  }
}
