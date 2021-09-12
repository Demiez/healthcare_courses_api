import * as chai from 'chai';
import { clone, cloneDeep } from 'lodash';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { v4 } from 'uuid';
import {
  generateRandomBoolean,
  generateRandomInteger,
  generateRandomNumber,
  generateStringOfLength,
} from '../../src/core/utils';
import { FieldIsBadModel } from '../../src/core/view-models';
import {
  MTC_ADDRESS_LENGTH,
  MTC_AVERAGE_RATING_MAX_VALUE,
  MTC_AVERAGE_RATING_MIN_VALUE,
  MTC_DESCRIPTION_LENGTH,
  MTC_NAME_LENGTH,
  MTC_PHONE_LENGTH,
} from '../../src/modules/module.mtc/constants';
import { CareerTypesEnum } from '../../src/modules/module.mtc/enums/career-types.enum';
import { CreateMtcRequestModel } from '../../src/modules/module.mtc/request-models';
import { CreateMtcRequestModelValidator } from '../../src/modules/module.validation';
import {
  ADDRESS_LENGTH_MESSAGE,
  AVERAGE_COST_MESSAGE,
  AVERAGE_RATING_INTERVAL_MESSAGE,
  DESCRIPTION_LENGTH_MESSAGE,
  NAME_LENGTH_MESSAGE,
  ONE_CAREER_MESSAGE,
  PHONE_LENGTH_MESSAGE,
  VALID_CAREER_MESSAGE,
  VALID_EMAIL_MESSAGE,
  VALID_SLUG_MESSAGE,
  VALID_URL_MESSAGE,
} from '../../src/modules/module.validation/constants';
import { BaseValidationMessagesEnum } from '../../src/modules/module.validation/enums';

chai.use(sinonChai);
const expect = chai.expect;

const globalData = {
  createMtcRequestModel: {} as CreateMtcRequestModel,
  stringValue: generateStringOfLength(10),
  numberValue: generateRandomNumber(0, 10),
  integerValue: generateRandomInteger(0, 10),
  booleanValue: generateRandomBoolean(),
  fieldName: `field-name-${v4()}`,
  defaultValidationResponse: [] as Array<FieldIsBadModel>,
};

function testNoValueProvidedCase(
  spiedMethod: Function,
  args: any,
  fieldName: string
) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(args);
  expect(spiedMethod).returned([
    new FieldIsBadModel(
      fieldName,
      BaseValidationMessagesEnum.PROVIDE_VALUE_MESSAGE
    ),
  ]);
}

function testValueProvidedCase(
  spiedMethod: Function,
  args: any,
  expectedReturn: Array<FieldIsBadModel> = []
) {
  expect(spiedMethod).calledOnce;
  expect(spiedMethod).calledWithExactly(args);
  expect(spiedMethod).returned(expectedReturn);
}

describe('UT - CreateMtcRequestModelValidator', () => {
  const sandbox = sinon.createSandbox();
  let testData: CreateMtcRequestModel;

  class CreateMtcRequestModelValidatorTester extends CreateMtcRequestModelValidator {
    constructor() {
      super();
    }
  }

  before(async () => {
    await setupData();
  });

  beforeEach(async () => {
    sandbox.spy(CreateMtcRequestModelValidatorTester, 'validate');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  describe(':: name validation', () => {
    it('should process valid name data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no name provided', async () => {
      testData.name = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'name'
      );
    });

    it('should return FieldIsBadModel when name is not a string', async () => {
      testData.name = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('name', BaseValidationMessagesEnum.MUST_BE_STRING)]
      );
    });

    it(`should not return FieldIsBadModel when name has <= ${MTC_NAME_LENGTH} characters`, async () => {
      testData.name = generateStringOfLength(MTC_NAME_LENGTH);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData
      );
    });

    it(`should return FieldIsBadModel when name has > ${MTC_NAME_LENGTH} characters`, async () => {
      testData.name = generateStringOfLength(MTC_NAME_LENGTH + 1);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('name', NAME_LENGTH_MESSAGE)]
      );
    });
  });

  describe(':: slug validation', () => {
    it('should process valid slug data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no slug provided', async () => {
      testData.slug = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'slug'
      );
    });

    it('should return FieldIsBadModel when slug is not a string', async () => {
      testData.slug = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('slug', BaseValidationMessagesEnum.MUST_BE_STRING)]
      );
    });

    it('should return FieldIsBadModel when slug is not a valid slug', async () => {
      testData.slug = globalData.stringValue + '_';

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('slug', VALID_SLUG_MESSAGE)]
      );
    });
  });

  describe(':: description validation', () => {
    it('should process valid description data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no description provided', async () => {
      testData.description = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'description'
      );
    });

    it('should return FieldIsBadModel when description is not a string', async () => {
      testData.description = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'description',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });

    it(`should not return FieldIsBadModel when description has <= ${MTC_DESCRIPTION_LENGTH} characters`, async () => {
      testData.description = generateStringOfLength(MTC_DESCRIPTION_LENGTH);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData
      );
    });

    it(`should return FieldIsBadModel when description has > ${MTC_DESCRIPTION_LENGTH} characters`, async () => {
      testData.description = generateStringOfLength(MTC_DESCRIPTION_LENGTH + 1);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('description', DESCRIPTION_LENGTH_MESSAGE)]
      );
    });
  });

  describe(':: website validation', () => {
    it('should process valid website data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no website provided', async () => {
      testData.website = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'website'
      );
    });

    it('should return FieldIsBadModel when website is not a string', async () => {
      testData.website = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'website',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when website is not a valid url', async () => {
      testData.website = globalData.stringValue;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('website', VALID_URL_MESSAGE)]
      );
    });
  });

  describe(':: email validation', () => {
    it('should process valid email data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no email provided', async () => {
      testData.email = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'email'
      );
    });

    it('should return FieldIsBadModel when email is not a string', async () => {
      testData.email = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'email',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when email is not a valid email address', async () => {
      testData.email = globalData.stringValue;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('email', VALID_EMAIL_MESSAGE)]
      );
    });
  });

  describe(':: phone validation', () => {
    it('should process valid phone data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no phone provided', async () => {
      testData.phone = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'phone'
      );
    });

    it('should return FieldIsBadModel when phone is not a string', async () => {
      testData.phone = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'phone',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });

    it(`should not return FieldIsBadModel when phone has <= ${MTC_PHONE_LENGTH} characters`, async () => {
      testData.phone = generateStringOfLength(MTC_PHONE_LENGTH);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData
      );
    });

    it(`should return FieldIsBadModel when phone has > ${MTC_PHONE_LENGTH} characters`, async () => {
      testData.phone = generateStringOfLength(MTC_PHONE_LENGTH + 1);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('phone', PHONE_LENGTH_MESSAGE)]
      );
    });
  });

  describe(':: address validation', () => {
    it('should process valid address data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no address provided', async () => {
      testData.address = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testNoValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        'address'
      );
    });

    it('should return FieldIsBadModel when address is not a string', async () => {
      testData.address = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'address',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });

    it(`should not return FieldIsBadModel when address has <= ${MTC_ADDRESS_LENGTH} characters`, async () => {
      testData.address = generateStringOfLength(MTC_ADDRESS_LENGTH);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData
      );
    });

    it(`should return FieldIsBadModel when address has > ${MTC_ADDRESS_LENGTH} characters`, async () => {
      testData.address = generateStringOfLength(MTC_ADDRESS_LENGTH + 1);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('address', ADDRESS_LENGTH_MESSAGE)]
      );
    });
  });

  // TODO - add location validation unit tests

  describe(':: careers validation', () => {
    it('should process valid careers data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when no careers provided', async () => {
      testData.careers = undefined;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('careers', ONE_CAREER_MESSAGE)]
      );
    });

    it('should return FieldIsBadModel when careers is not an array', async () => {
      testData.careers = {} as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('careers', ONE_CAREER_MESSAGE)]
      );
    });

    it('should return FieldIsBadModel when careers is empty', async () => {
      testData.careers = [];

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('careers', ONE_CAREER_MESSAGE)]
      );
    });

    it('should return FieldIsBadModel when careers includes invalid career', async () => {
      testData.careers.push(globalData.stringValue as any);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('careers', VALID_CAREER_MESSAGE)]
      );
    });
  });

  describe(':: avarageRating validation - optional field', () => {
    it('should process valid avarageRating data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when averageRating is not a number', async () => {
      testData.averageRating = globalData.stringValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'averageRating',
            BaseValidationMessagesEnum.MUST_BE_NUMBER
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when averageRating is not an integer', async () => {
      testData.averageRating = globalData.numberValue;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'averageRating',
            BaseValidationMessagesEnum.MUST_BE_INTEGER
          ),
        ]
      );
    });

    it(`should return FieldIsBadModel when averageRating is < ${MTC_AVERAGE_RATING_MIN_VALUE}`, async () => {
      testData.averageRating = MTC_AVERAGE_RATING_MIN_VALUE - 1;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('averageRating', AVERAGE_RATING_INTERVAL_MESSAGE)]
      );
    });

    it(`should return FieldIsBadModel when averageRating is > ${MTC_AVERAGE_RATING_MAX_VALUE}`, async () => {
      testData.averageRating = MTC_AVERAGE_RATING_MAX_VALUE + 1;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('averageRating', AVERAGE_RATING_INTERVAL_MESSAGE)]
      );
    });
  });

  describe(':: avarageCost validation - optional field', () => {
    it('should process valid avarageCost data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when averageCost is not a number', async () => {
      testData.averageCost = globalData.stringValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'averageCost',
            BaseValidationMessagesEnum.MUST_BE_NUMBER
          ),
        ]
      );
    });

    it(`should return FieldIsBadModel when averageCost is < 0`, async () => {
      testData.averageCost = -globalData.numberValue;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('averageCost', AVERAGE_COST_MESSAGE)]
      );
    });
  });

  describe(':: photo validation - optional field', () => {
    it('should process valid photo data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when photo is not a string', async () => {
      testData.photo = globalData.numberValue as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'photo',
            BaseValidationMessagesEnum.MUST_BE_STRING
          ),
        ]
      );
    });
  });

  describe(':: housing validation - optional field', () => {
    it('should process valid housing data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when housing is falsey but not boolean (0 value)', async () => {
      testData.housing = 0 as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'housing',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when housing is not a boolean', async () => {
      testData.housing = 'true' as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'housing',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });
  });

  describe(':: jobAssistance validation - optional field', () => {
    it('should process valid jobAssistance data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when jobAssistance is falsey but not boolean (0 value)', async () => {
      testData.jobAssistance = 0 as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'jobAssistance',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when jobAssistance is not a boolean', async () => {
      testData.jobAssistance = 'true' as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'jobAssistance',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });
  });

  describe(':: jobGuarantee validation - optional field', () => {
    it('should process valid jobGuarantee data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when jobGuarantee is falsey but not boolean (0 value)', async () => {
      testData.jobGuarantee = 0 as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'jobGuarantee',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when jobGuarantee is not a boolean', async () => {
      testData.jobGuarantee = 'true' as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'jobGuarantee',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });
  });

  describe(':: acceptGiBill validation - optional field', () => {
    it('should process valid acceptGiBill data', async () => {
      testData = cloneDeep(globalData.createMtcRequestModel);

      CreateMtcRequestModelValidatorTester.validate(testData);

      expect(CreateMtcRequestModelValidatorTester.validate).calledOnce;
      expect(CreateMtcRequestModelValidatorTester.validate).calledWithExactly(
        testData
      );
      expect(CreateMtcRequestModelValidatorTester.validate).returned(
        globalData.defaultValidationResponse
      );
    });

    it('should return FieldIsBadModel when acceptGiBill is falsey but not boolean (0 value)', async () => {
      testData.acceptGiBill = 0 as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'acceptGiBill',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });

    it('should return FieldIsBadModel when acceptGiBill is not a boolean', async () => {
      testData.acceptGiBill = 'true' as any;

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [
          new FieldIsBadModel(
            'acceptGiBill',
            BaseValidationMessagesEnum.MUST_BE_BOOLEAN
          ),
        ]
      );
    });
  });
});

async function setupData() {
  globalData.createMtcRequestModel = new CreateMtcRequestModel({
    name: `mtc-name-create-mtc-validator-${v4()}`,
    slug: `mtc-slug-create-mtc-validator-${v4()}`,
    description: `mtc-description-${v4()}`,
    website: `https://www.mtc-website-${v4()}.com`,
    phone: '(111) 222-0000',
    email: `mtc-email-${v4()}@gmail.com`,
    address: `mtc-address-${v4()}`,
    careers: [
      CareerTypesEnum.EKG_TECHNICIAN,
      CareerTypesEnum.PHLEBOTOMY_TECHNICIAN,
      CareerTypesEnum.PATIENT_CARE_TECHNICIAN,
      CareerTypesEnum.CERTIFIED_NURSE_AIDE,
      CareerTypesEnum.PERSONAL_CARE_AIDE,
      CareerTypesEnum.HOME_HEALTH_AIDE,
      CareerTypesEnum.BLS_CPR,
    ],
    averageRating: 5,
    averageCost: 1000,
    photo: `mtc-photo-${v4()}.jpg`,
    housing: true,
    jobAssistance: true,
    jobGuarantee: false,
    acceptGiBill: true,
  });
}
