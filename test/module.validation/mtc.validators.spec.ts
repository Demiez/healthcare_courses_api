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
import { CareerTypesEnum } from '../../src/modules/module.mtc/enums/career-types.enum';
import { CreateMtcRequestModel } from '../../src/modules/module.mtc/request-models';
import { CreateMtcRequestModelValidator } from '../../src/modules/module.validation';
import {
  NAME_LENGTH_MESSAGE,
  VALID_SLUG_MESSAGE,
} from '../../src/modules/module.validation/constants';
import { BaseValidationMessagesEnum } from '../../src/modules/module.validation/enums';

chai.use(sinonChai);
const expect = chai.expect;

const globalData = {
  createMtcRequestModel: {} as CreateMtcRequestModel,
  stringValue: `string-value-${v4()}`,
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

describe.only('UT - CreateMtcRequestModelValidator', () => {
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

    it('should not return FieldIsBadModel when name has <= 100 characters', async () => {
      testData.name = generateStringOfLength(100);

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData
      );
    });

    it('should return FieldIsBadModel when name has > 100 characters', async () => {
      testData.name = generateStringOfLength(101);

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
      testData.slug = generateStringOfLength(10) + '_';

      CreateMtcRequestModelValidatorTester.validate(testData);

      testValueProvidedCase(
        CreateMtcRequestModelValidatorTester.validate,
        testData,
        [new FieldIsBadModel('slug', VALID_SLUG_MESSAGE)]
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
