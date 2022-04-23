import * as process from 'process';
import { FieldIsBadModel } from '../../../core/view-models';
import { MTC_PHOTO_MIMETYPE_MESSAGE } from '../../module.mtc/constants';
import { MtcPhotoDataModel } from '../../module.mtc/models/mtc-photo.dm';
import { MAX_FILE_SIZE_MESSAGE } from '../constants';
import { BaseValidator } from './base.validator';

export class MtcPhotolValidator extends BaseValidator {
  public static validate(mtcPhotoData: MtcPhotoDataModel) {
    this.errors = [];

    const { mimetype, size } = mtcPhotoData;

    if (!mimetype.startsWith('image')) {
      this.errors.push(
        new FieldIsBadModel('mimetype', MTC_PHOTO_MIMETYPE_MESSAGE)
      );
    }

    if (size > Number(process.env.MAX_FILE_SIZE)) {
      this.errors.push(
        new FieldIsBadModel(
          'size',
          MAX_FILE_SIZE_MESSAGE + process.env.MAX_FILE_SIZE
        )
      );
    }

    return this.errors;
  }
}
