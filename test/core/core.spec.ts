import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import app from '../../src/app';
import { APP_ROOT, APP_ROOT_MESSAGE } from '../../src/core/constants';
import { logger, MongoMockHelper } from '../../src/core/utils';
import { StandardResponseViewModel } from '../../src/core/view-models';

chai.use(chaiHttp);
chai.should();

const checkRootEndpointResponseBody = (body: StandardResponseViewModel) => {
  body.should.haveOwnProperty('message');
  body.message.should.be.a('string');

  body.should.haveOwnProperty('status');
  body.status.should.be.a('string');

  body.message.should.equal(APP_ROOT_MESSAGE);
  body.status.should.equal('success');
};

let mongo: MongoMockHelper;

before(async () => {
  mongo = new MongoMockHelper();
  await mongo.openConnection();
  logger.info('Testing started');
  sinon.stub(logger, 'error');
  sinon.stub(logger, 'info');
});

after(async () => {
  sinon.restore();
  await mongo.closeConnection();
});

describe('Core Functionality', () => {
  describe(':: rootRoute', () => {
    it('should respond with HTTP 200 status', async () => {
      const res = await chai
        .request(app)
        .get(APP_ROOT)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.status.should.equal(200);
    });

    it('should respond with correct message and status', async () => {
      const res = await chai
        .request(app)
        .get(APP_ROOT)
        .catch((err) => {
          if (err.response) {
            return err.response as Response;
          } else {
            throw err;
          }
        });

      res.body.should.be.an('object');

      checkRootEndpointResponseBody(res.body);
    });
  });

  describe(':: Test DB', () => {
    it('db connection must be set', async () => {
      const connectionState = mongoose.connection.readyState;

      connectionState.should.equal(1);
    });
  });
});
