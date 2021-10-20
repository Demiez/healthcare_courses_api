import { Entry } from 'node-geocoder';
import { convertVariableToString } from '../../../core/utils';
import { FieldIsBadModel } from '../../../core/view-models';
import {
  FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE,
  LATITUDE_INTERVAL_MESSAGE,
  LATITUDE_PROVIDE_VALUE_MESSAGE,
  LONGITUDE_INTERVAL_MESSAGE,
  LONGITUDE_PROVIDE_VALUE_MESSAGE,
} from '../constants';
import { BaseValidator } from './base.validator';

export class LocationRequiredFieldsValidator extends BaseValidator {
  public static validate(geocodeLocationEntry: Entry) {
    this.errors = [];

    const { longitude, latitude, formattedAddress } = geocodeLocationEntry;

    this.validateLongitude(longitude, convertVariableToString({ longitude }));
    this.validateLatitude(latitude, convertVariableToString({ latitude }));
    this.validateFormattedAddress(
      formattedAddress,
      convertVariableToString({ formattedAddress })
    );

    return this.errors;
  }

  private static validateLongitude(longitude: number, fieldName: string) {
    const error = this.validateNumberField(
      longitude,
      fieldName,
      false,
      LONGITUDE_PROVIDE_VALUE_MESSAGE
    );

    if (error) {
      this.errors.push(error);
      return;
    }

    if (isFinite(longitude) && Math.abs(longitude) >= 180) {
      this.errors.push(
        new FieldIsBadModel(fieldName, LONGITUDE_INTERVAL_MESSAGE)
      );
    }
  }

  private static validateLatitude(latitude: number, fieldName: string) {
    const error = this.validateNumberField(
      latitude,
      fieldName,
      false,
      LATITUDE_PROVIDE_VALUE_MESSAGE
    );

    if (error) {
      this.errors.push(error);
      return;
    }

    if (isFinite(latitude) && Math.abs(latitude) >= 90) {
      this.errors.push(
        new FieldIsBadModel(fieldName, LATITUDE_INTERVAL_MESSAGE)
      );
    }
  }

  private static validateFormattedAddress(
    formattedAddress: string,
    fieldName: string
  ) {
    const error = this.validateStringField(
      formattedAddress,
      fieldName,
      FORMATTED_ADDRESS_PROVIDE_VALUE_MESSAGE
    );

    if (error) {
      this.errors.push(error);
      return;
    }
  }
}
