import { isEmpty } from 'lodash';
import { Service } from 'typedi';
import {
  BaseErrorCodes,
  ErrorCodes,
  ForbiddenError,
  NotFoundError,
} from '../../../core/errors';
import { IProjection, ISearchQuery } from '../../../core/interfaces';
import { geocoder } from '../../../core/utils';
import {
  FieldIsBadModel,
  StandardResponseViewModel,
} from '../../../core/view-models';
import { MtcRequestModelValidator } from '../../module.validation';
import { GetWithinRadiusValidator } from '../../module.validation/validators/get-within-radius.validator';
import { EARTH_RADIUS_IN_KM, EARTH_RADIUS_IN_MI } from '../constants';
import { IMtcDocument, MtcModel } from '../data-models/mtc.dm';
import { MeasurementUnitsEnum } from '../enums';
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

  public async getMtcsWithinRadius(
    zipcode: string,
    distance: number,
    unit: string
  ): Promise<MtcsViewModel> {
    this.validateGetMtcsWithinRadiusParams(zipcode, distance, unit);

    const { latitude, longitude } = await geocoder.geocodeCoordinates(zipcode);
    const earthRadius: number =
      unit === MeasurementUnitsEnum.KM
        ? EARTH_RADIUS_IN_KM
        : EARTH_RADIUS_IN_MI;

    const radiusInRadians = distance / earthRadius;

    const mtcsWithinRadius = await MtcModel.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radiusInRadians] },
      },
    });

    return new MtcsViewModel(
      mtcsWithinRadius.length,
      mtcsWithinRadius.map((mtc) => new MtcViewModel(mtc))
    );
  }

  public async getMtc(mtcId: string): Promise<MtcViewModel> {
    const mtc = await this.tryGetMtcById(mtcId);

    return new MtcViewModel(mtc);
  }

  public async createMtc(requestModel: MtcRequestModel): Promise<MtcViewModel> {
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

    if (mtc.name !== requestModel.name) {
      const isAnotherMtcRegisteredWithName = await this.checkIsMtcNameRegistered(
        requestModel.name,
        mtcId
      );

      if (isAnotherMtcRegisteredWithName) {
        throw new ForbiddenError(ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED, [
          'Another mtc with such name is already registered',
        ]);
      }
    }

    Object.assign(mtc, requestModel);

    await mtc.save();

    return new MtcViewModel(mtc);
  }

  public async deleteMtc(
    mtcId: string
  ): Promise<StandardResponseViewModel<{}>> {
    const mtc = await this.tryGetMtcById(mtcId);

    await mtc.deleteOne();

    return new StandardResponseViewModel({}, undefined, 'success');
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

  private validateGetMtcsWithinRadiusParams(
    zipcode: string,
    distance: number,
    unit: string
  ) {
    const errors = GetWithinRadiusValidator.validate(zipcode, distance, unit);

    if (errors.length) {
      throw new ForbiddenError(BaseErrorCodes.INVALID_INPUT_PARAMS, errors);
    }
  }

  private async checkIsMtcNameRegistered(
    mtcName: string,
    excludedMtcId?: string
  ) {
    const searchQuery: ISearchQuery = { name: mtcName };

    if (excludedMtcId) {
      searchQuery._id = { $ne: excludedMtcId };
    }

    const mtc = await MtcModel.findOne(searchQuery, '_id name');

    return mtc !== null;
  }
}
