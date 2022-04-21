import { Application } from 'express';
import * as multer from 'multer';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { MtcController } from '../controllers/mtc.controller';

export default (app: Application) => {
  const mtcController = Container.get(MtcController);
  const upload = multer({ dest: './files/' });

  app.get(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) => mtcController.getAllMtcs(req, res))
  );

  app.get(
    `${APP_ROOT}/mtcs/radius/:zipcode/:distance`,
    wrapRouteAction((req, res, next) =>
      mtcController.getMtcsWithinRadius(req, res)
    )
  );

  app.get(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.getMtc(req, res))
  );

  app.post(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) => mtcController.createMtc(req, res))
  );

  app.put(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.updateMtc(req, res))
  );

  app.delete(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) => mtcController.deleteMtc(req, res))
  );

  app.get(
    `${APP_ROOT}/mtcs/:mtcId/courses`,
    wrapRouteAction((req, res, next) => mtcController.getMtcCourses(req, res))
  );

  app.post(
    `${APP_ROOT}/mtcs/:mtcId/courses`,
    wrapRouteAction((req, res, next) => mtcController.createMtcCourse(req, res))
  );

  app.patch(
    `${APP_ROOT}/mtcs/:mtcId/courses`,
    wrapRouteAction((req, res, next) => mtcController.updateMtcCourse(req, res))
  );

  app.post(
    `${APP_ROOT}/mtcs/:mtcId/photo`,
    upload.single('photo_upload'),
    wrapRouteAction((req, res, next) => mtcController.uploadMtcPhoto(req, res))
  );
};
