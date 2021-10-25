import {
  MTC_ADDRESS_LENGTH,
  MTC_AVERAGE_RATING_MAX_VALUE,
  MTC_AVERAGE_RATING_MIN_VALUE,
  MTC_DESCRIPTION_LENGTH,
  MTC_NAME_LENGTH,
  MTC_PHONE_LENGTH,
} from '../../module.mtc/constants';

export const NAME_LENGTH_MESSAGE = `Cannot be more than ${MTC_NAME_LENGTH} characters`;
export const VALID_SLUG_MESSAGE = 'Please provide valid slug';
export const DESCRIPTION_LENGTH_MESSAGE = `Cannot be more than ${MTC_DESCRIPTION_LENGTH} characters`;
export const VALID_URL_MESSAGE = 'Please provide valid URL';
export const PHONE_LENGTH_MESSAGE = `Cannot be more than ${MTC_PHONE_LENGTH} characters`;
export const VALID_EMAIL_MESSAGE = 'Please provide valid email';
export const ADDRESS_LENGTH_MESSAGE = `Cannot be more than ${MTC_ADDRESS_LENGTH} characters`;
export const VALID_ADDRESS_MESSAGE = 'Please provide valid address line';
export const ONE_CAREER_MESSAGE = 'Please provide at least one career in list';
export const VALID_CAREER_MESSAGE = 'There must be only valid careers';
export const AVERAGE_RATING_INTERVAL_MESSAGE = `Must be from ${MTC_AVERAGE_RATING_MIN_VALUE} to ${MTC_AVERAGE_RATING_MAX_VALUE}`;
export const AVERAGE_COST_MESSAGE = 'Cannot be less than 0';
