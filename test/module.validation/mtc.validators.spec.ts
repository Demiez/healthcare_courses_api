import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { v4 } from 'uuid';
import app from '../../src/app';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../../src/core/constants';
import { logger, MongoMockHelper } from '../../src/core/utils';
import {
  generateRandomInteger,
  generateRandomNumber,
} from '../../src/core/utils';
import { CreateMtcRequestModelValidator } from '../../src/modules/module.validation';

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

const globalData = {
  stringValue: v4(),
  numberValue: generateRandomNumber(0, 10),
  integerValue: generateRandomInteger(0, 10),
  booleanValue: true,
  fieldName: 'FIELD_NAME',
};

describe('UT :: Base validator', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
    sandbox.spy(CreateMtcRequestModelValidator);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  it('validateStringField method with correct data', async () => {
    // CreateMtcRequestModelValidator.validateStringField(
    //   globalData.stringValue,
    //   globalData.fieldName
    // );
  });
});
