import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
@ApiModel({
  name: 'JwtTokenViewModel',
  description: 'Generated token after registration',
})
export class JwtTokenViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public token: string;

  constructor(token: string) {
    this.token = token;
  }
}
