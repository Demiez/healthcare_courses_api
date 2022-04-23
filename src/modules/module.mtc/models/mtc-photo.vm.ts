import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { MtcPhotoDataModel } from './mtc-photo.dm';

@ApiModel({
  name: 'MtcPhotoViewModel',
  description: 'Brief data of uploaded photo file',
})
export class MtcPhotoViewModel {
  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public mtcId: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.STRING, required: true })
  public fileName: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.NUMBER, required: true })
  public fileSize: number;

  constructor(fileData: MtcPhotoDataModel) {
    const { mtcId, saveFileName, size } = fileData;

    this.mtcId = mtcId;
    this.fileName = saveFileName;
    this.fileSize = size;
  }
}
