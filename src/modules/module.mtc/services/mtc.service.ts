import { isEmpty } from 'lodash';
import { Service } from 'typedi';
import {
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection } from '../../../core/interfaces';
import { StandardResponseViewModel } from '../../../core/view-models';
import { MtcRequestModelValidator } from '../../module.validation';
import { IMtcDocument, MtcModel } from '../data-models/mtc.dm';
import { MtcRequestModel } from '../request-models';
import { MtcsViewModel, MtcViewModel } from '../view-models';

@Service()
export class MtcService {
  public async getAllMtcs(): Promise<MtcsViewModel> {
    const mtcs = await MtcModel.find();

    if (isEmpty(mtcs)) {
      return new MtcsViewModel();
    }

    return new MtcsViewModel(
      mtcs.length,
      mtcs.map((mtc) => new MtcViewModel(mtc))
    );
  }

  public async getMtc(mtcId: string): Promise<MtcViewModel> {
    const mtc = await this.tryGetMtcById(mtcId);

    return new MtcViewModel(mtc);
  }

  public async createMtc(requestModel: MtcRequestModel): Promise<any> {
    this.validateMtcRequestModel(requestModel);

    const isMtcRegistered = await this.checkIsMtcNameRegistered(
      requestModel.name
    );

    if (isMtcRegistered) {
      throw new ForbiddenError(ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED, [
        'MTC with such name is already registered',
      ]);
    }

    const newMtc = new MtcModel(requestModel);

    await newMtc.save();

    return new MtcViewModel(newMtc);
  }

  public async updateMtc(
    mtcId: string,
    requestModel: MtcRequestModel
  ): Promise<MtcViewModel> {
    this.validateMtcRequestModel(requestModel);

    const mtc = await this.tryGetMtcById(mtcId);

    return new MtcViewModel(mtc);
  }

  public deleteMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(
      `Delete mtc by Id: ${mtcId}`,
      'success'
    );
  }

  public async tryGetMtcById(
    mtcId: String,
    projection: string | IProjection = {}
  ): Promise<IMtcDocument> {
    const mtc = await MtcModel.findById(mtcId, projection);

    if (!mtc) {
      throw new NotFoundError(ErrorCodes.RECORD_NOT_FOUND, ['mtc not found']);
    }

    return mtc;
  }

  private validateMtcRequestModel(requestModel: MtcRequestModel) {
    const errors = MtcRequestModelValidator.validate(requestModel);

    if (errors.length) {
      throw new ForbiddenError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private async checkIsMtcNameRegistered(mtcName: string) {
    const mtc = await MtcModel.findOne({ name: mtcName }, '_id name');

    return mtc !== null;
  }
}
