import { trim } from 'lodash';
import * as nodeGeocoder from 'node-geocoder';
import { MongooseLocationTypesEnum } from '../enums';
import { BadRequestError, ErrorCodes, InternalServerError } from '../errors';
import { IGeoJsonLocation } from '../interfaces';

const { GEOCODER_PROVIDER, GEOCODER_API_KEY } = process.env;

class Geocoder {
  private geocoder: nodeGeocoder.Geocoder;

  public async geocode(address: string): Promise<IGeoJsonLocation> {
    let locationEntryData: Array<nodeGeocoder.Entry>;

    try {
      locationEntryData = await this.geocoder.geocode(address);
    } catch (err) {
      if (err.message.includes('400')) {
        throw new BadRequestError(ErrorCodes.GEO_CODER_ERROR, [
          err.message.split(':')[1].trim(),
        ]);
      }
      throw new InternalServerError(ErrorCodes.GEO_CODER_ERROR);
    }

    const {
      longitude,
      latitude,
      formattedAddress,
      city,
      countryCode,
      streetName,
      stateCode,
      zipcode,
    } = locationEntryData[0];

    return {
      type: MongooseLocationTypesEnum.POINT,
      coordinates: [longitude, latitude],
      formattedAddress,
      street: streetName,
      city,
      state: stateCode,
      zipcode,
      country: countryCode,
    };
  }

  constructor() {
    this.geocoder = nodeGeocoder({
      provider: GEOCODER_PROVIDER,
      httpAdapter: 'https',
      apiKey: GEOCODER_API_KEY,
      formatter: null,
    } as nodeGeocoder.Options);
  }
}

export const geocoder = new Geocoder();
