import { keys, pick } from 'lodash';
import { join } from 'path';
import * as process from 'process';

export class MtcPhotoDataModel {
  public encoding: string = undefined;
  public filename: string = undefined;
  public mimetype: string = undefined;
  public size: string = undefined;
  public path: string = undefined;
  public mtcId: string = undefined;

  constructor(file: Express.Multer.File, mtcId: string) {
    const pickedFile = pick(file, keys(this));

    Object.assign(this, pickedFile);

    this.path = join(
      process.cwd(),
      `${process.env.FILE_UPLOAD_PATH}/${file.filename}`
    );
    this.mtcId = mtcId;
  }
}
