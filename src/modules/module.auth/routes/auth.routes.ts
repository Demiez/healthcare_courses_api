import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { AuthController } from '../controllers/auth.controller';
import { AuthProvider } from '../providers/auth.provider';

export default (app: Application) => {
  const authController = Container.get(AuthController);
  const authProvider = Container.get(AuthProvider);

  app.post(
    `${APP_ROOT}/auth/register`,
    wrapRouteAction((req, res, next) => authController.registerUser(req, res))
  );

  app.post(
    `${APP_ROOT}/auth/login`,
    wrapRouteAction((req, res, next) => authController.loginUser(req, res))
  );

  app.get(
    `${APP_ROOT}/auth/current-user`,
    authProvider.checkAuthentication,
    wrapRouteAction((req, res, next) => authController.getCurrentUser(req, res))
  );

  app.post(
    `${APP_ROOT}/auth/forgot-password`,
    wrapRouteAction((req, res, next) =>
      authController.processForgotPassword(req, res)
    )
  );

  app.put(
    `${APP_ROOT}/auth/reset-password/:resetToken`,
    wrapRouteAction((req, res, next) => authController.resetPassword(req, res))
  );
};
