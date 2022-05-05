import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { IResetPasswordTokenData } from '../interfaces/auth.interfaces';

@ApiModel({
  name: 'ResetPasswordTokenViewModel',
  description:
    'Model with generated token for password reset and expiration time',
})
export class ResetPasswordTokenViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public email: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public resetPasswordToken: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public resetPasswordExpirationDate: string;

  constructor(email: string, resetTokenData: IResetPasswordTokenData) {
    const { resetPasswordToken, resetPasswordExpiration } = resetTokenData;

    this.email = email;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpirationDate = resetPasswordExpiration.toISOString();
  }
}
