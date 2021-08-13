import { Application, Request, Response } from 'express';
import { APP_ROOT } from '../../../core/contants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { ModuleMtc_MtcController } from '../controllers/mtc.controller';

export default (app: Application) => {
  app.get(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) =>
      ModuleMtc_MtcController.getAllMtcs(req, res)
    )
  );

  app.get(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) =>
      ModuleMtc_MtcController.getMtc(req, res)
    )
  );

  app.post(
    `${APP_ROOT}/mtcs`,
    wrapRouteAction((req, res, next) =>
      ModuleMtc_MtcController.createMtc(req, res)
    )
  );

  app.put(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) =>
      ModuleMtc_MtcController.updateMtc(req, res)
    )
  );

  app.delete(
    `${APP_ROOT}/mtcs/:mtcId`,
    wrapRouteAction((req, res, next) =>
      ModuleMtc_MtcController.deleteMtc(req, res)
    )
  );
};
