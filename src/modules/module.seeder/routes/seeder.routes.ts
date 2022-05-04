import { Application } from 'express';
import Container from 'typedi';
import { APP_ROOT } from '../../../core/constants';
import { wrapRouteAction } from '../../../core/router/route-wrapper';
import { AuthProvider } from '../../module.auth/providers/auth.provider';
import { UserRolesEnum } from '../../module.user/enums/user-roles.enum';
import { SeederController } from '../controllers/seeder.controller';

export default (app: Application) => {
  const seederController = Container.get(SeederController);
  const authProvider = Container.get(AuthProvider);

  app.get(
    `${APP_ROOT}/seeder/all`,
    authProvider.checkAuthentication,
    authProvider.checkRoles([UserRolesEnum.ADMIN]),
    wrapRouteAction((req, res, next) => seederController.seedAll(req, res))
  );

  app.get(
    `${APP_ROOT}/seeder/mtcs`,
    authProvider.checkAuthentication,
    authProvider.checkRoles([UserRolesEnum.ADMIN]),
    wrapRouteAction((req, res, next) => seederController.seedMtcs(req, res))
  );

  app.get(
    `${APP_ROOT}/seeder/courses`,
    authProvider.checkAuthentication,
    authProvider.checkRoles([UserRolesEnum.ADMIN]),
    wrapRouteAction((req, res, next) => seederController.seedCourses(req, res))
  );

  app.delete(
    `${APP_ROOT}/seeder/all`,
    authProvider.checkAuthentication,
    authProvider.checkRoles([UserRolesEnum.ADMIN]),
    wrapRouteAction((req, res, next) => seederController.deleteMtcs(req, res))
  );
};
