import * as nodeGeocoder from 'node-geocoder';
import { LocationRequiredFieldsValidator } from '../../modules/module.validation';
import { MongooseLocationTypesEnum } from '../enums';
import {
  BadRequestError,
  ErrorCodes,
  ForbiddenError,
  InternalServerError,
} from '../errors';
import { ICoordinates, IGeoJsonLocation } from '../interfaces';
import { handleAsyncError } from './handle-async-error.util';

const { GEOCODER_PROVIDER, GEOCODER_API_KEY } = process.env;
class Geocoder {
  private geocoder: nodeGeocoder.Geocoder;
  private locationEntryData: Array<nodeGeocoder.Entry>;

  public async geocode(address: string): Promise<IGeoJsonLocation> {
    await this.getLocationEntryData(address);

    this.validateLocationEntryData();

    const {
      longitude,
      latitude,
      formattedAddress,
      city,
      countryCode,
      streetName,
      stateCode,
      zipcode,
    } = this.locationEntryData[0];

    return {
      type: MongooseLocationTypesEnum.POINT,
      coordinates: [longitude, latitude],
      formattedAddress,
      street: streetName,
      city,
      state: stateCode,
      zipcode,
      country: countryCode,
    } as IGeoJsonLocation;
  }

  public async geocodeCoordinates(zipcode: string): Promise<ICoordinates> {
    await this.getLocationEntryData(zipcode);

    const { latitude, longitude } = this.locationEntryData[0];

    return { latitude, longitude };
  }

  constructor() {
    this.geocoder = nodeGeocoder({
      provider: GEOCODER_PROVIDER,
      httpAdapter: 'https',
      apiKey: GEOCODER_API_KEY,
      formatter: null,
    } as nodeGeocoder.Options);
  }

  private async getLocationEntryData(input: string): Promise<void> {
    const [data, error] = await handleAsyncError<Array<nodeGeocoder.Entry>>(
      this.geocoder.geocode(input)
    );

    if (error) {
      if (error.message.includes('400')) {
        throw new BadRequestError(ErrorCodes.GEO_CODER_ERROR, [
          error.message.split(':')[1].trim(),
        ]);
      }
      throw new InternalServerError(ErrorCodes.GEO_CODER_ERROR);
    }

    this.locationEntryData = data;
  }

  private validateLocationEntryData() {
    const errors = LocationRequiredFieldsValidator.validate(
      this.locationEntryData[0]
    );

    if (errors.length) {
      throw new ForbiddenError(ErrorCodes.GEO_CODER_ERROR, errors);
    }
  }
}

export const geocoder = new Geocoder();
