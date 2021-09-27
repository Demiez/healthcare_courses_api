import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { cloneDeep } from 'lodash';
import 'mocha';
import { Query } from 'mongoose';
import { v4 } from 'uuid';
import app from '../../src/app';
import { APP_ROOT } from '../../src/core/constants';
import { ErrorCodes } from '../../src/core/errors';
import { MtcModel } from '../../src/modules/module.mtc/data-models/mtc.dm';
import { CareerTypesEnum } from '../../src/modules/module.mtc/enums/career-types.enum';
import { MtcRequestModel } from '../../src/modules/module.mtc/request-models';
import { MtcViewModel } from '../../src/modules/module.mtc/view-models';
import { VALID_EMAIL_MESSAGE } from '../../src/modules/module.validation/constants';
import { BaseValidationMessagesEnum } from '../../src/modules/module.validation/enums';

chai.use(chaiHttp);
chai.should();

const globalData = {
  mtcId: '',
  mtcForUpdate: {} as MtcViewModel,
  mtcDuplicateNameForUpdate: '',
  mtcRequestModel: {} as MtcRequestModel,
  totalMtcsInDB: 5,
};

const checkMtcResponseBody = (body: MtcViewModel) => {
  body.should.have.property('id');
  body.id.should.be.a('string');

  body.should.have.property('name');
  body.name.should.be.a('string');

  body.should.have.property('slug');
  body.slug.should.be.a('string');

  body.should.have.property('description');
  body.description.should.be.a('string');

  body.should.have.property('website');
  body.website.should.be.a('string');

  body.should.have.property('phone');
  body.phone.should.be.a('string');

  body.should.have.property('email');
  body.email.should.be.a('string');

  body.should.have.property('address');
  body.address.should.be.a('string');

  body.should.have.property('location');
  body.location.should.be.an('object');
  // TODO : Add indepth location check
  body.location.should.be.empty;

  body.should.have.property('careers');
  body.careers.should.be.an('array');
  body.careers.forEach((career) =>
    career.should.be.oneOf(Object.values(CareerTypesEnum))
  );

  body.should.have.property('averageRating');
  body.averageRating.should.be.a('number');

  body.should.have.property('averageCost');
  body.averageCost.should.be.a('number');

  body.should.have.property('photo');
  body.photo.should.be.a('string');

  body.should.have.property('housing');
  body.housing.should.be.a('boolean');

  body.should.have.property('jobAssistance');
  body.jobAssistance.should.be.a('boolean');

  body.should.have.property('jobGuarantee');
  body.jobGuarantee.should.be.a('boolean');

  body.should.have.property('acceptGiBill');
  body.acceptGiBill.should.be.a('boolean');
};

const checkBaseErrorResponse = (res: Response, resStatus: number) => {
  res.status.should.equal(resStatus);
  res.body.should.be.an('object');
  res.body.should.have.property('errorCode').that.is.a('string');
  res.body.should.have.property('errorDetails').that.is.an('array');
  res.body.should.have.property('type').that.is.a('string');
};

const sendRequestCreateMtc = (mtcRequestModel: MtcRequestModel) =>
  chai
    .request(app)
    .post(`${APP_ROOT}/mtcs`)
    .send(mtcRequestModel)
    .catch((err) => {
      if (err.response) {
        return err.response as Response;
      } else {
        throw err;
      }
    });

const sendRequestUpdateMtc = (mtcId: string, mtcData: MtcViewModel) =>
  chai
    .request(app)
    .put(`${APP_ROOT}/mtcs/${mtcId}`)
    .send(mtcData)
    .catch((err) => {
      if (err.response) {
        return err.response as Response;
      } else {
        throw err;
      }
    });

describe('MTC Controller', () => {
  before(async () => {
    await setupData();
  });

  after(async () => {
    await clearData();
  });

  describe(':: POST part', () => {
    it('Create mtc with valid request model', async () => {
      const res = await sendRequestCreateMtc(globalData.mtcRequestModel);

      res.status.should.equal(200);
      res.body.should.be.an('object');
      checkMtcResponseBody(res.body);
    });

    it('Create mtc with invalid fields in request model', async () => {
      const invalidRequestModel = Object.assign(
        cloneDeep(globalData.mtcRequestModel),
        {
          name: 1,
          careers: ['NON_EXISTING_CAREER_01', 'NON_EXISTING_CAREER_02'],
        }
      );

      const res = await sendRequestCreateMtc(invalidRequestModel);

      checkBaseErrorResponse(res as Response, 403);
      res.body.errorCode.should.equal(ErrorCodes.INVALID_INPUT_PARAMS);
      res.body.errorDetails.length.should.equal(2);
      res.body.errorDetails[0].should.deep.equal({
        field: 'name',
        message: BaseValidationMessagesEnum.MUST_BE_STRING,
      });
      res.body.errorDetails[1].should.deep.equal({
        field: 'careers',
        message: 'There must be only valid careers',
      });
    });

    it('Create mtc with already existing name', async () => {
      const res = await sendRequestCreateMtc(globalData.mtcRequestModel);

      checkBaseErrorResponse(res as Response, 403);
      res.body.errorCode.should.equal(
        ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED
      );
      res.body.errorDetails[0].should.equal(
        'MTC with such name is already registered'
      );
    });
  });

  describe(':: GET part', () => {
    it('Get all mtcs from DB', async () => {
      const res = await chai
        .request(app)
        .get(`${APP_ROOT}/mtcs`)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.status.should.equal(200);
      res.body.should.be.an('object');
      res.body.should.haveOwnProperty('total');
      res.body.total.should.be.a('number');
      res.body.total.should.equal(globalData.totalMtcsInDB);
      res.body.should.haveOwnProperty('mtcs');
      res.body.mtcs.should.be.an('array');
      res.body.mtcs.length.should.equal(globalData.totalMtcsInDB);
      res.body.mtcs.forEach((mtc: MtcViewModel) => checkMtcResponseBody(mtc));

      globalData.mtcId = res.body.mtcs[0].id;
      globalData.mtcDuplicateNameForUpdate = res.body.mtcs[1].name;
    });

    it('Get mtc by invalid id', async () => {
      const res = await chai
        .request(app)
        .get(`${APP_ROOT}/mtcs/${v4()}`)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      checkBaseErrorResponse(res as Response, 404);
      res.body.errorCode.should.equal(ErrorCodes.RECORD_NOT_FOUND);
      res.body.errorDetails[0].should.equal('mtc not found');
    });

    it('Get mtc by valid id', async () => {
      const res = await chai
        .request(app)
        .get(`${APP_ROOT}/mtcs/${globalData.mtcId}`)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.status.should.equal(200);
      res.body.should.be.an('object');
      res.body.id.should.equal(globalData.mtcId);
      checkMtcResponseBody(res.body);
      globalData.mtcForUpdate = res.body;
    });
  });

  describe(':: PUT part', () => {
    it('Update mtc by invalid id', async () => {
      const res = await sendRequestUpdateMtc(v4(), globalData.mtcForUpdate);

      checkBaseErrorResponse(res as Response, 404);
      res.body.errorCode.should.equal(ErrorCodes.RECORD_NOT_FOUND);
      res.body.errorDetails[0].should.equal('mtc not found');
    });

    it('Update mtc by valid id', async () => {
      const newMtcName = `new-mtc-name-${v4()}`;
      globalData.mtcForUpdate.name = newMtcName;

      const res = await sendRequestUpdateMtc(
        globalData.mtcForUpdate.id,
        globalData.mtcForUpdate
      );

      res.status.should.equal(200);
      res.body.should.be.an('object');
      res.body.name.should.equal(newMtcName);
      checkMtcResponseBody(res.body);
    });

    it('Update mtc with duplicate name', async () => {
      globalData.mtcForUpdate.name = globalData.mtcDuplicateNameForUpdate;

      const res = await sendRequestUpdateMtc(
        globalData.mtcForUpdate.id,
        globalData.mtcForUpdate
      );

      checkBaseErrorResponse(res as Response, 403);
      res.body.errorCode.should.equal(
        ErrorCodes.MTC_NAME_IS_ALREADY_REGISTERED
      );
      res.body.errorDetails[0].should.equal(
        'Another mtc with such name is already registered'
      );
    });

    it('Update mtc with invalid fields in request model', async () => {
      const invalidRequestModel = Object.assign(
        cloneDeep(globalData.mtcForUpdate),
        {
          email: v4(),
          averageRating: v4(),
        }
      );

      const res = await sendRequestUpdateMtc(
        invalidRequestModel.id,
        invalidRequestModel
      );

      checkBaseErrorResponse(res as Response, 403);
      res.body.errorCode.should.equal(ErrorCodes.INVALID_INPUT_PARAMS);
      res.body.errorDetails.length.should.equal(2);
      res.body.errorDetails[0].should.deep.equal({
        field: 'email',
        message: VALID_EMAIL_MESSAGE,
      });
      res.body.errorDetails[1].should.deep.equal({
        field: 'averageRating',
        message: BaseValidationMessagesEnum.MUST_BE_NUMBER,
      });
    });
  });

  describe(':: DELETE part', () => {
    it('Delete mtc by invalid id', async () => {
      const res = await chai
        .request(app)
        .del(`${APP_ROOT}/mtcs/${v4()}`)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      checkBaseErrorResponse(res as Response, 404);
      res.body.errorCode.should.equal(ErrorCodes.RECORD_NOT_FOUND);
      res.body.errorDetails[0].should.equal('mtc not found');
    });

    it('Delete mtc by valid id', async () => {
      const res = await chai
        .request(app)
        .del(`${APP_ROOT}/mtcs/${globalData.mtcId}`)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.status.should.equal(200);
      res.body.should.be.an('object');
      res.body.should.haveOwnProperty('result');
      res.body.result.should.be.an('object').that.is.empty;
      res.body.should.haveOwnProperty('status');
      res.body.status.should.be.a('string').that.equal('success');
    });
  });
});

async function setupData() {
  for (let i = 0; i < globalData.totalMtcsInDB; i++) {
    const requestModel = new MtcRequestModel({
      name: `mtc-name-${i}-${v4()}`,
      description: `mtc-description-${i}-${v4()}`,
      website: `https://www.mtc-website-${i}-${v4()}.com`,
      phone: `(111) 222-000${i}`,
      email: `mtc-email-${i}-${v4()}@gmail.com`,
      address: `mtc-address-${i}-${v4()}`,
      careers: [
        CareerTypesEnum.EKG_TECHNICIAN,
        CareerTypesEnum.PHLEBOTOMY_TECHNICIAN,
        CareerTypesEnum.PATIENT_CARE_TECHNICIAN,
        CareerTypesEnum.CERTIFIED_NURSE_AIDE,
        CareerTypesEnum.PERSONAL_CARE_AIDE,
        CareerTypesEnum.HOME_HEALTH_AIDE,
        CareerTypesEnum.BLS_CPR,
      ],
      averageRating: 1 + i,
      averageCost: 1000 + i,
      photo: `mtc-photo-${i}-${v4()}.jpg`,
      housing: true,
      jobAssistance: true,
      jobGuarantee: false,
      acceptGiBill: true,
    });

    if (i !== globalData.totalMtcsInDB - 1) {
      const mtc = new MtcModel(requestModel);

      await mtc.save();
    } else {
      globalData.mtcRequestModel = requestModel;
    }
  }
}

async function clearData() {
  await Promise.all<Query<unknown, unknown> | Promise<unknown>>([
    MtcModel.deleteMany({}),
  ]);
}
