import { Service } from 'typedi';
import {
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
} from '../../../core/errors';
import { StandardResponseViewModel } from '../../../core/view-models';
import { CreateMtcRequestModelValidator } from '../../module.validation';
import { MtcModel } from '../data-models/mtc.dm';
import { CreateMtcRequestModel } from '../request-models';
import { MtcViewModel } from '../view-models';

@Service()
export class MtcService {
  public getAllMtcs(): StandardResponseViewModel {
    return new StandardResponseViewModel('Show all mtcs', 'success');
  }

  public getMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(`Show mtc by Id: ${mtcId}`, 'success');
  }

  public async createMtc(requestModel: CreateMtcRequestModel): Promise<any> {
    const errors = CreateMtcRequestModelValidator.validate(requestModel);

    if (errors.length) {
      throw new ForbiddenError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }

    // remove
    return new StandardResponseViewModel(`MTC created`, 'success');
    const isMtcRegistered = await this.isMtcNameRegistered(requestModel.name);

    if (isMtcRegistered) {
      throw new ForbiddenError(ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED, [
        'MTC with such name is already registered',
      ]);
    }

    const newMtc = new MtcModel(requestModel);

    await newMtc.save();

    return new MtcViewModel(newMtc);
  }

  public updateMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(
      `Update mtc by Id: ${mtcId}`,
      'success'
    );
  }

  public deleteMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(
      `Delete mtc by Id: ${mtcId}`,
      'success'
    );
  }

  private async isMtcNameRegistered(mtcName: string) {
    const mtc = await MtcModel.findOne({ name: mtcName }, '_id name');

    return mtc !== null;
  }
}
