import * as fs from 'fs';
import { isEmpty } from 'lodash';
import { Service } from 'typedi';
import {
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection, ISearchQuery } from '../../../core/interfaces';
import { StandardResponseViewModel } from '../../../core/view-models';
import { MtcModel } from '../../module.mtc/data-models/mtc.dm';
import { MtcsViewModel } from '../../module.mtc/view-models';
import { MtcRequestModelValidator } from '../../module.validation';

@Service()
export class SeederService {
  public async seedMtcs() {
    const mtcs = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/mtcs.json`, 'utf-8')
    );

    await MtcModel.create(mtcs);

    return new StandardResponseViewModel(
      undefined,
      'Mtc data imported',
      'success'
    );
  }
}
