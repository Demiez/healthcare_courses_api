import * as nodeGeocoder from 'node-geocoder';
import { LocationRequiredFieldsValidator } from '../../modules/module.validation';
import { MongooseLocationTypesEnum } from '../enums';
import {
  BadRequestError,
  ErrorCodes,
  ForbiddenError,
  InternalServerError,
} from '../errors';
import { IGeoJsonLocation } from '../interfaces';

const { GEOCODER_PROVIDER, GEOCODER_API_KEY } = process.env;

class Geocoder {
  private geocoder: nodeGeocoder.Geocoder;
  private locationEntryData: Array<nodeGeocoder.Entry>;

  public async geocode(address: string): Promise<IGeoJsonLocation> {
    try {
      this.locationEntryData = await this.geocoder.geocode(address);
    } catch (err) {
      if (err.message.includes('400')) {
        throw new BadRequestError(ErrorCodes.GEO_CODER_ERROR, [
          err.message.split(':')[1].trim(),
        ]);
      }
      throw new InternalServerError(ErrorCodes.GEO_CODER_ERROR);
    }

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

  constructor() {
    this.geocoder = nodeGeocoder({
      provider: GEOCODER_PROVIDER,
      httpAdapter: 'https',
      apiKey: GEOCODER_API_KEY,
      formatter: null,
    } as nodeGeocoder.Options);
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
